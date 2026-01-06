"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { createTag, getTags } from "@/lib/actions/tags";
import { toast } from "sonner";
import pinyin from "tiny-pinyin";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface TagSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function TagSelector({ value = [], onChange }: TagSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    getTags().then(setTags);
  }, []);

  const handleCreateTag = async () => {
    if (!inputValue.trim()) return;

    let slug = inputValue.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (pinyin.isSupported()) {
      slug = pinyin.convertToPinyin(inputValue, "-", true);
    }
    slug = slug.replace(/^-+|-+$/g, "").replace(/-+/g, "-");

    const result = await createTag({
      name: inputValue.trim(),
      slug: slug || `tag-${Date.now()}`,
    });

    if (result.success && result.data) {
      setTags((prev) => [...prev, result.data!]);
      onChange([...value, result.data!.id]);
      setInputValue("");
      toast.success("标签已创建");
    } else {
      toast.error(result.error || "创建标签失败");
    }
  };

  const selectedTags = tags.filter((tag) => value.includes(tag.id));

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length > 0
              ? `已选择 ${value.length} 个标签`
              : "选择或创建标签..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="搜索标签..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 p-2">
                  <span className="text-sm text-muted-foreground">
                    未找到标签
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-full"
                    onClick={handleCreateTag}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    创建 "{inputValue}"
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {tags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => {
                      if (value.includes(tag.id)) {
                        onChange(value.filter((id) => id !== tag.id));
                      } else {
                        onChange([...value, tag.id]);
                      }
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(tag.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="pr-1">
              {tag.name}
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 h-3 w-3 rounded-full hover:bg-transparent"
                onClick={() => onChange(value.filter((id) => id !== tag.id))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
