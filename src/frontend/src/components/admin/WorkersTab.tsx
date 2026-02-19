import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RefreshCw } from 'lucide-react';
import { useGetAllWorkers } from '../../hooks/useQueries';

export default function WorkersTab() {
  const { data: workers, isLoading, refetch } = useGetAllWorkers();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Worker Profiles</h2>
          <p className="text-muted-foreground">View all registered worker profiles</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading workers...</p>
        </div>
      ) : workers && workers.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id.toString()}>
                  <TableCell className="font-mono text-sm">{worker.id.toString()}</TableCell>
                  <TableCell className="font-medium">{worker.name}</TableCell>
                  <TableCell>{worker.skill}</TableCell>
                  <TableCell>{worker.category}</TableCell>
                  <TableCell>{worker.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No workers registered yet</p>
        </div>
      )}
    </div>
  );
}
