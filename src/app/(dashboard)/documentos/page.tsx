import { PageHeader } from '@/components/layout/PageHeader';
import { db } from '@/db';
import { certidoes, documentos, fornecedores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';
import { formatDate, statusCertidao } from '@/lib/utils';

async function getData() {
  const [certs, docs] = await Promise.all([
    db.select({
      id: certidoes.id,
      tipo: certidoes.tipo,
      dataValidade: certidoes.dataValidade,
      documentoUrl: certidoes.documentoUrl,
      fornecedorNome: fornecedores.razaoSocial,
    }).from(certidoes).leftJoin(fornecedores, eq(certidoes.fornecedorId, fornecedores.id)),
    db.select().from(documentos),
  ]);
  return { certs, docs };
}

const certBadge = { valida: 'ok', atencao: 'warn', vencida: 'err' } as const;

export default async function DocumentosPage() {
  const { certs, docs } = await getData();

  return (
    <div>
      <PageHeader title="Documentos" description="Certidões e documentos contratuais" />

      <Card className="mb-6">
        <Card.Header><h3 className="font-semibold">Certidões por Fornecedor</h3></Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Head>
              <tr>
                <Table.Th>Fornecedor</Table.Th>
                <Table.Th>Tipo certidão</Table.Th>
                <Table.Th>Validade</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Doc</Table.Th>
              </tr>
            </Table.Head>
            <Table.Body>
              {certs.map((c) => {
                const st = statusCertidao(c.dataValidade);
                return (
                  <Table.Row key={c.id}>
                    <Table.Td className="font-medium">{c.fornecedorNome ?? '—'}</Table.Td>
                    <Table.Td>{c.tipo.replace('_', ' ')}</Table.Td>
                    <Table.Td>{formatDate(c.dataValidade)}</Table.Td>
                    <Table.Td><Badge variant={certBadge[st]} dot>{st}</Badge></Table.Td>
                    <Table.Td>{c.documentoUrl ? <a href={c.documentoUrl} target="_blank" rel="noreferrer" className="text-pri hover:underline text-xs">Ver</a> : '—'}</Table.Td>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header><h3 className="font-semibold">Documentos Gerais</h3></Card.Header>
        <Card.Body className="p-0">
          <Table>
            <Table.Head>
              <tr>
                <Table.Th>Nome</Table.Th>
                <Table.Th>Tipo</Table.Th>
                <Table.Th>Upload</Table.Th>
                <Table.Th>Link</Table.Th>
              </tr>
            </Table.Head>
            <Table.Body>
              {docs.length === 0 ? (
                <tr><Table.Td colSpan={4} className="text-center py-8 text-gray-500">Nenhum documento</Table.Td></tr>
              ) : docs.map((d) => (
                <Table.Row key={d.id}>
                  <Table.Td className="font-medium">{d.nome}</Table.Td>
                  <Table.Td><Badge variant="info">{d.tipo}</Badge></Table.Td>
                  <Table.Td className="text-xs">{formatDate(d.criadoEm)}</Table.Td>
                  <Table.Td><a href={d.url} target="_blank" rel="noreferrer" className="text-pri hover:underline text-xs">Abrir</a></Table.Td>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}
