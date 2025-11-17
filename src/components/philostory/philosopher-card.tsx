import { Card, CardContent } from "@/components/ui/card";
import type { Philosopher } from "@/types/database";

interface PhilosopherCardProps {
  philosopher: Philosopher;
}

export function PhilosopherCard({ philosopher }: PhilosopherCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {philosopher.image_url ? (
            <img
              src={philosopher.image_url}
              alt={philosopher.name_ko}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {philosopher.name_ko.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{philosopher.name_ko}</h3>
            <p className="text-sm text-muted-foreground">{philosopher.name}</p>
            {philosopher.era && (
              <p className="text-sm text-muted-foreground mt-1">
                {philosopher.era}
                {philosopher.nationality && ` · ${philosopher.nationality}`}
              </p>
            )}
            {philosopher.bio && (
              <p className="text-sm mt-2 line-clamp-3">{philosopher.bio}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
