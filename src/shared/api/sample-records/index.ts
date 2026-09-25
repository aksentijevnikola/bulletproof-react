import { SampleRecord, SampleRecordList } from "../generated/schemas";
import {
  getGetSampleRecordQueryKey,
  getListSampleRecordsQueryKey,
  getSampleRecord as generatedGetSampleRecord,
  listSampleRecords as generatedListSampleRecords,
  renameSampleRecord as generatedRenameSampleRecord,
} from "../generated/sample-records";

export { getGetSampleRecordQueryKey, getListSampleRecordsQueryKey };
export type { SampleRecordOutput } from "../generated/schemas";

function requireSuccess(status: number) {
  if (status !== 200) throw new Error(`Sample API request failed with HTTP ${status}`);
}

export async function listSampleRecords(options?: RequestInit) {
  const response = await generatedListSampleRecords(options);
  requireSuccess(response.status);
  return SampleRecordList.parse(response.data);
}

export async function getSampleRecord(recordId: string, options?: RequestInit) {
  const response = await generatedGetSampleRecord(recordId, options);
  requireSuccess(response.status);
  return SampleRecord.parse(response.data);
}

export async function renameSampleRecord(recordId: string, title: string) {
  const response = await generatedRenameSampleRecord(recordId, { title });
  requireSuccess(response.status);
  return SampleRecord.parse(response.data);
}
