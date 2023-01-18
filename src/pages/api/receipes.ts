import { initManagement } from '@/lib/contentfulManagement';

export default function handler(req, res) {
  console.log(initManagement());
  res.status(200).json({ test: `test` });
}

// export function getReceipes() {
//   initManagement();
// }
