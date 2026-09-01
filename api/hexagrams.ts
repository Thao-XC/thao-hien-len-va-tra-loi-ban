import hexagramsData from '../src/hexagrams.json' with { type: 'json' };

export default function handler(req: any, res: any) {
  res.status(200).json(hexagramsData);
}
