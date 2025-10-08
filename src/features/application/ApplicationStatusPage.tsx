import Timeline from "@/components/ui/Timeline";
export default function ApplicationStatusPage(){
  const steps = [
    { label:"Recibida", done:true, date:"2025-09-10" },
    { label:"Pre-evaluación", done:true, date:"2025-09-12" },
    { label:"Entrevista", active:true, note:"Pendiente coordinar horario" },
    { label:"Visita domiciliaria" },
    { label:"Aprobación clínica" },
    { label:"Contrato/Entrega" },
    { label:"Seguimiento 30/90 días" },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estado de tu solicitud #A-00123</h1>
      <Timeline steps={steps}/>
    </div>
  );
}
