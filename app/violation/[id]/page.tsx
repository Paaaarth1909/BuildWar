import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ViolationStatusTimeline } from "@/components/violation/violation-status-timeline"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

export default async function ViolationDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch violation details
  const { data: violation, error } = await supabase
    .from("violations")
    .select(`
      *,
      violation_categories (name),
      violation_media (id, media_url, media_type)
    `)
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .single()

  if (error || !violation) {
    notFound()
  }

  // Fetch status updates
  const { data: statusUpdates } = await supabase
    .from("violation_status_updates")
    .select("*")
    .eq("violation_id", params.id)
    .order("created_at", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{violation.violation_categories?.name || "Traffic Violation"}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge>{violation.status}</Badge>
              <span className="text-sm text-muted-foreground">
                Reported {format(new Date(violation.created_at), "PPP")}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(violation.violation_date), "PPP p")}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{violation.location_address || "Location not specified"}</span>
              </div>
            </div>

            {violation.description && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Description</h2>
                <p>{violation.description}</p>
              </div>
            )}

            {violation.plate_number && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Vehicle Plate Number</h2>
                <p>{violation.plate_number}</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Evidence</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {violation.violation_media && violation.violation_media.length > 0 ? (
                violation.violation_media.map((media) => (
                  <Card key={media.id}>
                    <CardContent className="p-0">
                      {media.media_type.startsWith("image/") ? (
                        <img
                          src={media.media_url || "/placeholder.svg"}
                          alt="Violation evidence"
                          className="w-full h-auto rounded-md"
                        />
                      ) : (
                        <video src={media.media_url} controls className="w-full h-auto rounded-md" />
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>No evidence files uploaded</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              {statusUpdates && statusUpdates.length > 0 ? (
                <ViolationStatusTimeline statusUpdates={statusUpdates} />
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No status updates yet. Your report is being reviewed.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

