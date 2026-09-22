'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

const PATH = '/admin/produtos';
const BUCKET = 'produtos';

export type AcaoResultado = { ok?: boolean; error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autorizado.');
}

async function uploadImagem(imagem: File): Promise<string> {
  const ext = (imagem.name.split('.').pop() || 'jpg').toLowerCase();
  const nomeArquivo = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(nomeArquivo, imagem, {
      contentType: imagem.type || 'image/jpeg',
      upsert: false,
    });
  if (error) throw new Error('upload');

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(nomeArquivo);
  return data.publicUrl;
}

export async function listarProdutos() {
  const produtos = await prisma.produto.findMany({
    orderBy: { criadoEm: 'desc' },
    include: { categoria: { select: { nome: true } } },
  });

  // Decimal não é serializável p/ Client Component → converte para number.
  return produtos.map((p) => ({
    id: p.id,
    nome: p.nome,
    descricao: p.descricao,
    preco: Number(p.preco),
    imagemUrl: p.imagemUrl,
    ativo: p.ativo,
    categoriaId: p.categoriaId,
    categoriaNome: p.categoria.nome,
  }));
}

function lerCampos(formData: FormData) {
  const nome = String(formData.get('nome') ?? '').trim();
  const descricao = String(formData.get('descricao') ?? '').trim() || null;
  const preco = Number(String(formData.get('preco') ?? '').replace(',', '.'));
  const categoriaId = String(formData.get('categoriaId') ?? '');
  return { nome, descricao, preco, categoriaId };
}

function validar(nome: string, preco: number, categoriaId: string): string | null {
  if (!nome) return 'Nome é obrigatório.';
  if (!categoriaId) return 'Escolha uma categoria.';
  if (!Number.isFinite(preco) || preco <= 0) return 'Preço inválido.';
  return null;
}

export async function criarProduto(formData: FormData): Promise<AcaoResultado> {
  await requireUser();
  const { nome, descricao, preco, categoriaId } = lerCampos(formData);
  const erro = validar(nome, preco, categoriaId);
  if (erro) return { error: erro };

  const imagem = formData.get('imagem') as File | null;
  let imagemUrl: string | null = null;
  try {
    if (imagem && imagem.size > 0) imagemUrl = await uploadImagem(imagem);
  } catch {
    return {
      error: 'Falha no upload da imagem. Confira se o bucket "produtos" existe e é público.',
    };
  }

  await prisma.produto.create({
    data: { nome, descricao, preco, imagemUrl, categoriaId },
  });
  revalidatePath(PATH);
  revalidatePath('/');
  return { ok: true };
}

export async function atualizarProduto(
  id: string,
  formData: FormData,
): Promise<AcaoResultado> {
  await requireUser();
  const { nome, descricao, preco, categoriaId } = lerCampos(formData);
  const erro = validar(nome, preco, categoriaId);
  if (erro) return { error: erro };

  const imagem = formData.get('imagem') as File | null;
  let novaImagemUrl: string | undefined;
  try {
    if (imagem && imagem.size > 0) novaImagemUrl = await uploadImagem(imagem);
  } catch {
    return { error: 'Falha no upload da nova imagem.' };
  }

  await prisma.produto.update({
    where: { id },
    data: {
      nome,
      descricao,
      preco,
      categoriaId,
      // só troca a imagem se enviaram uma nova
      ...(novaImagemUrl ? { imagemUrl: novaImagemUrl } : {}),
    },
  });
  revalidatePath(PATH);
  revalidatePath('/');
  return { ok: true };
}

export async function alternarAtivoProduto(
  id: string,
  ativo: boolean,
): Promise<void> {
  await requireUser();
  await prisma.produto.update({ where: { id }, data: { ativo } });
  revalidatePath(PATH);
  revalidatePath('/');
}

export async function removerProduto(id: string): Promise<void> {
  await requireUser();
  await prisma.produto.delete({ where: { id } });
  revalidatePath(PATH);
  revalidatePath('/');
}
