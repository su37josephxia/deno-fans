import { serve } from "https://deno.land/std@v0.36.0/http/server.ts";
const s = serve({ port: 3000 });
console.log("http://localhost:3000/");
for await (const req of s) {
  console.log('await ...', req.url)
  if (req.url === '/exit') {
    
  }
  req.respond({ body: "Hello World\n" });
}