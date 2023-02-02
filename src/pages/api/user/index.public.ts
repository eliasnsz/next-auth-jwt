import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";


const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => {

  return res.status(200).json({ ok: true })
} 

export default handler