import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ViolationCard } from "@/components/violation/violation-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle } from "lucide-react"

export default async function DashboardPage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch user's violations
  const { data: violations, error } = await supabase
    .from("violations")
    .select(`
      id,
      category_id,
      location_address,
      violation_date,
      status,
      created_at,
      violation_categories (name),
      violation_media (media_url, media_type)
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching violations:", error)
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Error loading your reports. Please try again later.</p>
      </div>
    )
  }

  // Transform data for easier consumption in the component
  const formattedViolations = violations.map((v) => ({
    id: v.id,
    category: v.violation_categories?.name || "Unknown",
    location_address: v.location_address,
    violation_date: v.violation_date,
    status: v.status,
    created_at: v.created_at,
    media: v.violation_media || [],
  }))

  // Filter violations by status
  const pendingViolations = formattedViolations.filter((v) => v.status.toLowerCase() === "pending")
  const inProgressViolations = formattedViolations.filter((v) => v.status.toLowerCase() === "in progress")
  const resolvedViolations = formattedViolations.filter(
    (v) => v.status.toLowerCase() === "resolved" || v.status.toLowerCase() === "rejected",
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Reports</h1>
        <Link href="/report">
          <Button className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Report New Violation
          </Button>
        </Link>
      </div>

      {formattedViolations.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Reports Yet</h2>
          <p className="text-muted-foreground mb-6">You haven't reported any traffic violations yet.</p>
          <Link href="/report">
            <Button>Report Your First Violation</Button>
          </Link>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All ({formattedViolations.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingViolations.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgressViolations.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolvedViolations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {formattedViolations.map((violation) => (
              <ViolationCard key={violation.id} violation={violation} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingViolations.map((violation) => (
              <ViolationCard key={violation.id} violation={violation} />
            ))}
          </TabsContent>

          <TabsContent value="in-progress" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressViolations.map((violation) => (
              <ViolationCard key={violation.id} violation={violation} />
            ))}
          </TabsContent>

          <TabsContent value="resolved" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resolvedViolations.map((violation) => (
              <ViolationCard key={violation.id} violation={violation} />
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

