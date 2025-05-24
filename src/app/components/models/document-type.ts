export class DocumentType {
  id: number;
  name: string;
  libelle: string;
  category: number;
  selected: number;
  isVersionable: number;
  attr: Map<String, number> = new Map<String, number>();
}
