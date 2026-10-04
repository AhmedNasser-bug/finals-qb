#!/bin/bash
sed -i 's/for await (const chunk of stream) {/stream.on("data", (chunk: Buffer) => chunks.push(chunk)); stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8"))); stream.on("error", reject);/g' app/actions.ts
