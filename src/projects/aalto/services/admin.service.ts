import { doTransaction, sleep } from 'src/utils/transaction.utils';
import { getAalto, getWrappedAalto } from '../utils/aalto-contract.utils';

export async function updateAaltoFeeExempt(who: string, exempt: boolean) {
  const aalto = await getAalto();
  await doTransaction(aalto.setFeeExempt(who, exempt));
}

export async function updateWrappedAaltoFeeExempt(
  who: string,
  exempt: boolean,
) {
  const wAalto = await getWrappedAalto();
  await doTransaction(wAalto.setFeeExempt(who, exempt));
}

export async function updateAaltoAndWrappedFeeExempt(
  who: string,
  exempt: boolean,
) {
  await updateAaltoFeeExempt(who, exempt);
  await updateWrappedAaltoFeeExempt(who, exempt);
}

export async function updateListAaltoAndWrappedFeeExempt(
  whos: string[],
  exempt: boolean,
) {
  // TODO: Could save failed tx's for already exempt by multicalling address exempt status first and filtering out
  for (const who of whos) {
    await updateAaltoFeeExempt(who, exempt);
    await updateWrappedAaltoFeeExempt(who, exempt);
    await sleep(1000);
  }
}
