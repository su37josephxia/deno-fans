const url = Deno.args[0]
const res = await fetch(url)
await Deno.copy(Deno.stdout,res.body)