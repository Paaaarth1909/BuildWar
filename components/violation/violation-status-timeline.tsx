import { formatDistanceToNow } from "date-fns"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface StatusUpdate {
  id: number
  previous_status: string | null
  new_status: string
  comment: string | null
  created_at: string
}

interface ViolationStatusTimelineProps {
  statusUpdates: StatusUpdate[]
}

export function ViolationStatusTimeline({ statusUpdates }: ViolationStatusTimelineProps) {
  const sortedUpdates = [...statusUpdates].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "in progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "resolved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Status Timeline</h3>
      <div className="space-y-4">
        {sortedUpdates.map((update, index) => (
          <div key={update.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                {getStatusIcon(update.new_status)}
              </div>
              {index < sortedUpdates.length - 1 && <div className="w-0.5 bg-muted h-full mt-1"></div>}
            </div>
            <div className="flex-1 pt-1.5 pb-8">
              <p className="font-medium">
                Status changed to: <span className="font-bold">{update.new_status}</span>
              </p>
              {update.previous_status && (
                <p className="text-sm text-muted-foreground">Previous status: {update.previous_status}</p>
              )}
              {update.comment && <p className="mt-1 text-sm">{update.comment}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

