
import httpx
import asyncio
import traceback

async def run():
    print("Testing connection to API Gateway -> OpenClaw -> Ollama...")
    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            # First check stats to ensure API is up
            print("Checking /stats endpoint...")
            resp = await client.get('http://localhost:8000/stats')
            print(f"Stats Status: {resp.status_code}")
            
            # Now test chat
            print("Sending chat message...")
            payload = {
                "messages": [
                    {
                        "role": "user",
                        "content": "Consulta la base de datos: ¿Cuántas licitaciones hay registradas en total?"
                    }
                ]
            }
            res = await client.post('http://localhost:8000/chat', json=payload)
            
            print(f'Chat Status: {res.status_code}')
            print(f'Chat Response Payload: {res.text}')
            
            if res.status_code == 200:
                data = res.json()
                print(f"Content: {data.get('response')}")
            else:
                print("Request failed.")

    except Exception as e:
        print("EXCEPTION OCCURRED:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run())
