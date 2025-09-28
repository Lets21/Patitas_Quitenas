import EmptyState from "@/components/ui/EmptyState";
export default function AnimalDetailPage(){
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Perfil del perro</h1>
      <EmptyState description="Aquí va el carrusel de fotos, tabs de Descripción / Ficha clínica / Similares y CTA de Solicitar." />
    </div>
  );
}
