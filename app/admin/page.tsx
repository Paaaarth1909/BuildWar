import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// This is a mock admin page to demonstrate how authorities might interact with the system
export default async function AdminPage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // In a real app, we would check if the user has admin privileges
  // For demo purposes, we'll just show all violations

  // Fetch all violations
  const { data: violations, error } = await supabase
    .from("violations")
    .select(`
      id,
      user_id,
      location_address,
      violation_date,
      status,
      created_at,
      plate_number,
      violation_categories (name)
    `)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching violations:", error)
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Error loading violations. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">This is a mock admin interface for demonstration purposes</p>
      </div>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
        <p className="text-yellow-700">
          <strong>Note:</strong> In a real application, this page would be restricted to authorized traffic authorities
          only.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date Reported</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {violations.map((violation) => (
              <TableRow key={violation.id}>
                <TableCell className="font-mono text-sm">{violation.id.substring(0, 8)}...</TableCell>
                <TableCell>{violation.violation_categories?.name}</TableCell>
                <TableCell className="max-w-xs truncate">{violation.location_address || "N/A"}</TableCell>
                <TableCell>{format(new Date(violation.created_at), "PP")}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      violation.status === "pending"
                        ? "outline"
                        : violation.status === "in progress"
                          ? "secondary"
                          : violation.status === "resolved"
                            ? "default"
                            : "destructive"
                    }
                  >
                    {violation.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/violation/${violation.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="w-full">
            Export Reports
          </Button>
          <Button variant="outline" className="w-full">
            Generate Statistics
          </Button>
          <Button variant="outline" className="w-full">
            Manage Users
          </Button>
        </div>
      </div>
    </div>
  )
}

