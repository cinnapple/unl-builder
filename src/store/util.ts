export const updateObject = <TState>(
  oldObject: TState,
  updatedValues: TState
) => {
  return <TState>{
    ...(oldObject as any),
    ...(updatedValues as any)
  };
};
