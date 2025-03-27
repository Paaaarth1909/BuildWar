import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ViolationForm } from "@/components/violation/violation-form"

export default async function ReportPage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch violation categories
  const { data: categories, error } = await supabase.from("violation_categories").select("id, name").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return (
      <div className="container mx-auto px-4 py-12">
        <p>Error loading categories. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Report a Traffic Violation</h1>
      <ViolationForm categories={categories} />
    </div>
  )
}

