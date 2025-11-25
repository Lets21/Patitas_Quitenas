import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Eye, Trash2, MessageSquare, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  destination?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

const statusLabels: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' }> = {
  NEW: { label: 'Nuevo', variant: 'error' },
  READ: { label: 'Leído', variant: 'info' },
  REPLIED: { label: 'Respondido', variant: 'success' },
  ARCHIVED: { label: 'Archivado', variant: 'warning' },
};

const ContactMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filterStatus === 'all' 
        ? `${API_URL}/api/v1/contact`
        : `${API_URL}/api/v1/contact?status=${filterStatus}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al cargar mensajes');
      
      const result = await response.json();
      setMessages(result.data || []);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al cargar los mensajes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filterStatus]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/contact/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Error al actualizar estado');

      toast.success('Estado actualizado');
      fetchMessages();
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, status: status as any });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/v1/contact/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar mensaje');

      toast.success('Mensaje eliminado');
      fetchMessages();
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al eliminar el mensaje');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'NEW') {
      updateStatus(message._id, 'READ');
    }
  };

  const filteredMessages = messages;

  const newMessagesCount = messages.filter(m => m.status === 'NEW').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mensajes de Contacto
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona los mensajes recibidos de los usuarios
              </p>
            </div>
            {newMessagesCount > 0 && (
              <Badge variant="error">
                {newMessagesCount} {newMessagesCount === 1 ? 'nuevo' : 'nuevos'}
              </Badge>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtrar:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'NEW', 'READ', 'REPLIED', 'ARCHIVED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Todos' : statusLabels[status]?.label || status}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de mensajes */}
          <div className="space-y-4">
            {filteredMessages.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay mensajes</p>
              </Card>
            ) : (
              filteredMessages.map((message) => (
                <Card
                  key={message._id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                    selectedMessage?._id === message._id
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : message.status === 'NEW'
                      ? 'bg-blue-50'
                      : ''
                  }`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {message.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {message.email}
                      </p>
                    </div>
                    <Badge variant={statusLabels[message.status].variant}>
                      {statusLabels[message.status].label}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    {message.subject}
                  </p>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {message.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(message.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {message.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {message.phone}
                      </span>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Detalle del mensaje */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {selectedMessage ? (
              <Card className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Detalle del Mensaje
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMessage(null)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Nombre
                    </label>
                    <p className="text-gray-900 font-medium">
                      {selectedMessage.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      {selectedMessage.email}
                    </a>
                  </div>

                  {selectedMessage.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Teléfono
                      </label>
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}

                  {selectedMessage.destination && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Destino
                      </label>
                      <p className="text-gray-900 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedMessage.destination}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Asunto
                    </label>
                    <p className="text-gray-900 font-medium">
                      {selectedMessage.subject}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Mensaje
                    </label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                    <span>
                      Recibido:{' '}
                      {new Date(selectedMessage.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {selectedMessage.status !== 'REPLIED' && (
                      <Button
                        onClick={() => updateStatus(selectedMessage._id, 'REPLIED')}
                        variant="outline"
                        size="sm"
                      >
                        ✓ Marcar respondido
                      </Button>
                    )}
                    {selectedMessage.status !== 'ARCHIVED' && (
                      <Button
                        onClick={() => updateStatus(selectedMessage._id, 'ARCHIVED')}
                        variant="outline"
                        size="sm"
                      >
                        📁 Archivar
                      </Button>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => setDeleteConfirm(selectedMessage._id)}
                    variant="outline"
                    className="w-full text-red-600 hover:bg-red-50"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar mensaje
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Selecciona un mensaje para ver los detalles
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteMessage(deleteConfirm)}
          title="Eliminar mensaje"
          message="¿Estás seguro de que deseas eliminar este mensaje? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          type="danger"
        />
      )}
    </div>
  );
};

export default ContactMessagesPage;
