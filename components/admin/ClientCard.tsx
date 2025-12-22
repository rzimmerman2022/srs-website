import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { maskEmail, formatRelativeTime } from '@/lib/utils';

export interface ClientData {
  id: string;
  name: string;
  email: string;
  questionnaireCount: number;
  lastActivity: string;
  completedCount?: number;
}

interface ClientCardProps {
  client: ClientData;
}

export default function ClientCard({ client }: ClientCardProps) {
  const completionRate = client.questionnaireCount > 0
    ? Math.round(((client.completedCount || 0) / client.questionnaireCount) * 100)
    : 0;

  return (
    <Link href={`/admin/clients/${client.id}`}>
      <Card
        interactive
        className="h-full transition-all duration-300 hover:border-gold/50"
      >
        <CardHeader>
          <CardTitle as="h3" className="text-xl mb-2">
            {client.name}
          </CardTitle>
          <p className="text-sm text-charcoal-400" aria-label={`Email: ${client.email}`}>
            {maskEmail(client.email)}
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-charcoal-500 mb-1">Questionnaires</p>
                <p className="text-2xl font-bold text-navy">
                  {client.questionnaireCount}
                </p>
              </div>

              <div>
                <p className="text-sm text-charcoal-500 mb-1">Completion</p>
                <p className="text-2xl font-bold text-navy">
                  {completionRate}%
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {client.questionnaireCount > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-charcoal-500">
                  <span>{client.completedCount || 0} completed</span>
                  <span>{client.questionnaireCount - (client.completedCount || 0)} in progress</span>
                </div>
                <div className="w-full bg-sand-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-gold to-gold-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                    role="progressbar"
                    aria-valuenow={completionRate}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${completionRate}% of questionnaires completed`}
                  />
                </div>
              </div>
            )}

            {/* Last Activity */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-charcoal-500">
                Last activity:{' '}
                <time
                  dateTime={client.lastActivity}
                  className="text-charcoal-600 font-medium"
                >
                  {formatRelativeTime(client.lastActivity)}
                </time>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
