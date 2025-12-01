import mongoose, { Schema, Document } from 'mongoose';

export interface IPokemon extends Document {
  pokeapiId: number;
  name: string;
  types: string[];
  abilities: string[];
  flavorText: string;
  sprites: {
    front_default?: string;
    other?: any;
  };
  embedding: number[];
  cachedAt: Date;
}

const PokemonSchema = new Schema<IPokemon>({
  pokeapiId: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true },
  types: [String],
  abilities: [String],
  flavorText: { type: String, default: '' },
  sprites: {
    front_default: String,
    other: Schema.Types.Mixed
  },
  embedding: [Number],
  cachedAt: { type: Date, default: Date.now }
});

PokemonSchema.index({ cachedAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.models.Pokemon || mongoose.model<IPokemon>('Pokemon', PokemonSchema);