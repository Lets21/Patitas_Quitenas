import EmptyState from "@/components/ui/EmptyState";
export default function ApplicationWizard(){
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Solicitud de adopción</h1>
      <EmptyState description="Wizard de 6 pasos: Datos > Hogar > Experiencia > Compatibilidad > Adjuntos > Confirmación." />
    </div>
  );
}
