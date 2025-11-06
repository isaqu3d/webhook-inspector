import * as Dialog from "@radix-ui/react-dialog";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Loader2, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { webhookListSchema } from "../http/schemas/webhooks";
import { CodeBlock } from "./ui/code-block";
import { WebhooksListItem } from "./webhooks-list-item";

export function WebhooksList() {
  const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([]);
  const [generateHandlerCode, setGenerateHandlerCode] = useState<string | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["webhooks"],
      queryFn: async ({ pageParam }) => {
        const url = new URL("http://localhost:3333/api/webhooks");

        if (pageParam) {
          url.searchParams.set("cursor", pageParam);
        }
        const response = await fetch(url);

        const data = await response.json();

        return webhookListSchema.parse(data);
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ?? undefined;
      },
      initialPageParam: undefined as string | undefined,
    });

  const webhooks = data.pages.flatMap((page) => page.webhooks);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  function handleCheckWebhook(checkedWebhookId: string) {
    if (checkedWebhooksIds.includes(checkedWebhookId)) {
      setCheckedWebhooksIds((state) => {
        return state.filter((webhookId) => webhookId !== checkedWebhookId);
      });
    } else {
      setCheckedWebhooksIds((state) => [...state, checkedWebhookId]);
    }
  }

  async function handleGenerateHandler() {
    setIsGenerating(true);
    try {
      const response = await fetch("http://localhost:3333/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhookIds: checkedWebhooksIds,
        }),
      });

      type GenerateHandlerResponse = { code: string };

      const data: GenerateHandlerResponse = await response.json();

      setGenerateHandlerCode(data.code);
    } finally {
      setIsGenerating(false);
    }
  }

  const hasAnyWebhookChecked = checkedWebhooksIds.length > 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {hasAnyWebhookChecked && (
            <button
              disabled={!hasAnyWebhookChecked || isGenerating}
              className="flex items-center justify-center gap-3 font-medium text-sm bg-indigo-400 text-white w-full rounded-lg disabled:opacity-50 mb-3 p-2"
              onClick={() => handleGenerateHandler()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Gerando handler...
                </>
              ) : (
                <>
                  <Wand2 className="size-4" /> Gerar handler
                </>
              )}
            </button>
          )}

          {webhooks.map((webhook) => {
            return (
              <WebhooksListItem
                key={webhook.id}
                webhook={webhook}
                onWebhookChecked={handleCheckWebhook}
                isWebhookChecked={checkedWebhooksIds.includes(webhook.id)}
              />
            );
          })}
        </div>

        {hasNextPage && (
          <div className="p-2" ref={loadMoreRef}>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="size-5 animate-spin text-zinc-500" />
              </div>
            )}
          </div>
        )}
      </div>

      {!!generateHandlerCode && (
        <Dialog.Root defaultOpen>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-20" />

          <Dialog.Content className="flex justify-center items-center fixed left-1/2 top-1/2 max-h-[90vh] w-[90vw] -translate-y-1/2 -translate-x-1/2 z-40">
            <div className="bg-zinc-900 w-[600px] p-4 rounded-lg border border-zinc-800 max-h-[620px] overflow-auto">
              <CodeBlock language="typescript" code={generateHandlerCode} />
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </>
  );
}
