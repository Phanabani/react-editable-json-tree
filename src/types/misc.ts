export type Factory<Args, Value> = (args: Args) => Value;
export type MaybeFactory<Args, Value> = Value | Factory<Args, Value>;
