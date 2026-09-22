// Dados da vitrine usados pela landing page.
// Temporário: quando o CRUD de produtos estiver pronto (com Supabase Storage),
// a landing passa a ler isto do banco via Prisma. As imagens estão em /public/imports.

export type Categoria = { id: string; label: string; priceLabel: string };
export type Produto = {
  id: string;
  name: string;
  note: string;
  price: string;
  categoryId: string;
  img: string;
};

export const HERO_IMG = "/imports/WhatsApp_Image_2026-09-21_at_9.27.18_PM.jpeg";

export const categorias: Categoria[] = [
  { id: "pote", label: "Bolo de Pote", priceLabel: "R$ 15" },
  { id: "gelado", label: "Bolo Gelado", priceLabel: "R$ 9" },
];

export const produtos: Produto[] = [
  {
    id: "p1",
    name: "Bolo Chocolatudo Matilda",
    note: "Camada de bolo de chocolate 50%, brigadeiro de cacau e confeitos de chocolate ao leite",
    price: "R$ 15",
    categoryId: "pote",
    img: "/imports/bolo_chocolatudo_matilda.jpeg",
  },
  {
    id: "p2",
    name: "Bolo de Pote Prestígio",
    note: "Camadas de bolo de chocolate, brigadeiro, beijinho e coberto com coco ralado",
    price: "R$ 15",
    categoryId: "pote",
    img: "/imports/WhatsApp_Image_2026-09-21_at_9.26.21_PM.jpeg",
  },
  {
    id: "p3",
    name: "Bolo de Pote de Ninho",
    note: "Camadas de bolo de chocolate com brigadeiro de ninho",
    price: "R$ 15",
    categoryId: "pote",
    img: "/imports/WhatsApp_Image_2026-09-21_at_9.31.00_PM.jpeg",
  },
  {
    id: "p4",
    name: "Bolo Toalha Felpuda",
    note: "Bolo de coco saboroso, calda de leite de coco, leite condensado e coco ralado",
    price: "R$ 9",
    categoryId: "gelado",
    img: "/imports/coco.jpeg",
  },
  {
    id: "p5",
    name: "Bolo Gelado de Chocolate",
    note: "Bolo de chocolate molhadinho, calda e confeito de chocolate ao leite",
    price: "R$ 9",
    categoryId: "gelado",
    img: "/imports/WhatsApp_Image_2026-09-21_at_11.14.11_PM.jpeg",
  },
];
