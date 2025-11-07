import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { WebhookDetailsSkeleton } from "../../features/webhooks/components/webhook-details/webhook-details-skeleton";
import { WebhookDetails } from "../../features/webhooks/components/webhook-details/webhook-details";

export const Route = createFileRoute("/webhook/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <Suspense fallback={<WebhookDetailsSkeleton />}>
      <WebhookDetails id={id} />
    </Suspense>
  );
}
