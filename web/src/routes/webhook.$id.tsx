import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { WebhookDetails } from "../components/webhook-details";
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
    <Suspense fallback={<div>Loading webhook details...</div>}>
      <WebhookDetails id={id} />
    </Suspense>
  );
}
