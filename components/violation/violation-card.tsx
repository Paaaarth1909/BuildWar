import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, MapPin } from "lucide-react"

interface ViolationCardProps {
  violation: {
    id: string
    category: string
    location_address: string | null
    violation_date: string
    status: string
    created_at: string
    media: { media_url: string; media_type: string }[]
  }
}

export function ViolationCard({ violation }: ViolationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500"
      case "in progress":
        return "bg-blue-500"
      case "resolved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-muted">
        {violation.media && violation.media.length > 0 ? (
          <img
            src={violation.media[0].media_url || "/placeholder.svg"}
            alt={`Evidence for ${violation.category}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image available</div>
        )}
        <Badge className={`absolute top-2 right-2 ${getStatusColor(violation.status)}`}>{violation.status}</Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{violation.category}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-1 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground line-clamp-2">
            {violation.location_address || "Location not specified"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(violation.created_at), { addSuffix: true })}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/violation/${violation.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

