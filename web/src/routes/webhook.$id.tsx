import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SectionDataTable } from "../components/section-data-table";
import { SectionTitle } from "../components/section-title";
import { CodeBlock } from "../components/ui/code-block";
import { WebhookDetailHeader } from "../components/ui/webhook-detail-header";
import { webhookDetailSchema } from "../http/schemas/webhooks";

export const Route = createFileRoute("/webhook/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  const { data } = useSuspenseQuery({
    queryKey: ["webhook", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/api/webhooks/${id}`);

      const data = await response.json();

      return webhookDetailSchema.parse(data);
    },
  });

  const overviewData = [
    {
      key: "Method",
      value: data.method,
    },

    {
      key: "Status Code",
      value: data.statusCode,
    },

    {
      key: "Content-Type",
      value: data.contentType || "application/json",
    },

    {
      key: "Content-Length",
      value: `${data.contentLength || "0"} bytes`,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <WebhookDetailHeader
        method={data.method}
        pathname={data.pathname}
        ip={data.ip}
        createdAt={data.createdAt}
      />

      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <SectionTitle className="text-sm font-semibold text-zinc-100">
              Request Overview
            </SectionTitle>

            <SectionDataTable data={overviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle className="text-sm font-semibold text-zinc-100">
              Query Parameters
            </SectionTitle>

            <SectionDataTable data={overviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle className="text-sm font-semibold text-zinc-100">
              Headers
            </SectionTitle>
            <SectionDataTable data={overviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle className="text-sm font-semibold text-zinc-100">
              Request Body
            </SectionTitle>

            <CodeBlock code={JSON.stringify(overviewData, null, 2)} />
          </div>
        </div>
      </div>
    </div>
  );
}
