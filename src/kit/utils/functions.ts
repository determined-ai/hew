export const copyToClipboard = async (content: string): Promise<void> => {
  try {
    // This method is only available on https and localhost
    await navigator.clipboard.writeText(content);
  } catch (e) {
    throw new Error('Clipboard access on https and localhost only!');
  }
};

export const isNotNullish = <T>(arg: T): arg is Exclude<T, null | undefined> =>
  arg !== null && arg !== undefined;
