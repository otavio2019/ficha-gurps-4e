export type CloudRecord = { id: string };

/** Retorna somente os registros que foram carregados ou criados na conta conectada. */
export function selectCloudBackedRecords<T extends CloudRecord>(records: T[], cloudRecordIds: readonly string[]): T[] {
  const ids = new Set(cloudRecordIds);
  return records.filter((record) => ids.has(record.id));
}
