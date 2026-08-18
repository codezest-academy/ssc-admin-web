import { useState } from 'react';
import type { ExamNotification, CreateExamNotificationPayload } from '@/api/notifications';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  
} from '@/api/notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateExamNotificationPayload>({
    title: '',
    organization: '',
    vacancies: 0,
    applicationStartDate: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
    applicationEndDate: new Date().toISOString().split('T')[0] + 'T23:59:59.000Z',
    notificationLink: '',
    logoUrl: '',
    isActive: true,
  });

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(true),
  });

  const createMut = useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateExamNotificationPayload> }) => updateNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      organization: '',
      vacancies: 0,
      applicationStartDate: new Date().toISOString().split('T')[0] + 'T00:00:00.000Z',
      applicationEndDate: new Date().toISOString().split('T')[0] + 'T23:59:59.000Z',
      notificationLink: '',
      logoUrl: '',
      isActive: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMut.mutate({ id: editingId, data: formData });
    } else {
      createMut.mutate(formData);
    }
  };

  const handleEdit = (notification: any) => {
    setEditingId(notification.id);
    setFormData({
      title: notification.title,
      organization: notification.organization,
      vacancies: notification.vacancies,
      applicationStartDate: notification.applicationStartDate,
      applicationEndDate: notification.applicationEndDate,
      notificationLink: notification.notificationLink,
      logoUrl: notification.logoUrl || '',
      isActive: notification.isActive,
    });
    setIsDialogOpen(true);
  };

  if (isLoading) return <div className="p-8">Loading notifications...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exam Alerts</h1>
          <p className="text-muted-foreground">Manage job alerts and exam notifications for students.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setIsDialogOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Alert' : 'Create New Alert'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Exam Title</Label>
                  <Input 
                    required 
                    placeholder="e.g. SSC CGL 2026" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organization</Label>
                  <Input 
                    required 
                    placeholder="e.g. Staff Selection Commission" 
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vacancies</Label>
                  <Input 
                    type="number" 
                    required 
                    min="0"
                    value={formData.vacancies}
                    onChange={(e) => setFormData({ ...formData, vacancies: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notification Link (PDF URL)</Label>
                  <Input 
                    type="url" 
                    required 
                    value={formData.notificationLink}
                    onChange={(e) => setFormData({ ...formData, notificationLink: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Application Start Date</Label>
                  <Input 
                    type="datetime-local" 
                    required 
                    value={formData.applicationStartDate.slice(0, 16)}
                    onChange={(e) => setFormData({ ...formData, applicationStartDate: new Date(e.target.value).toISOString() })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Application End Date</Label>
                  <Input 
                    type="datetime-local" 
                    required 
                    value={formData.applicationEndDate.slice(0, 16)}
                    onChange={(e) => setFormData({ ...formData, applicationEndDate: new Date(e.target.value).toISOString() })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Logo URL (Optional)</Label>
                  <Input 
                    type="url" 
                    value={formData.logoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 col-span-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <Label htmlFor="isActive">Active (Visible to students)</Label>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createMut.isPending || updateMut.isPending}>
                {editingId ? 'Update Alert' : 'Create Alert'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Exam</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Vacancies</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications?.map((n: ExamNotification) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.title}</TableCell>
                <TableCell>{n.organization}</TableCell>
                <TableCell>{n.vacancies.toLocaleString()}</TableCell>
                <TableCell>{format(new Date(n.applicationEndDate), 'MMM dd, yyyy')}</TableCell>
                <TableCell>
                  <Badge variant={n.isActive ? 'default' : 'secondary'}>
                    {n.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(n)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (confirm('Are you sure you want to delete this alert?')) {
                      deleteMut.mutate(n.id);
                    }
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {notifications?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No exam alerts found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
