import asyncio
from collections import defaultdict
import random
import httpx
from playwright.async_api import async_playwright

API_URL = "http://localhost:5000/api/data"
APP_URL = "http://localhost:5173/#/ring-details/{}"


async def fetch_all_ring_ids_async():
    payload = {"pageIndex": 1, "pageSize": 1000000, "filters": []}

    async with httpx.AsyncClient() as client:
        response = await client.post(API_URL, json=payload)
        response.raise_for_status()
        data = response.json()

    return [row["ring_id"] for row in data.get("rows", [])]

def extract_ccd_id(ring_id: str) -> str:
    """Extract the CCD ID (3rd element) from a ring_id string."""
    parts = ring_id.split('_')
    if len(parts) >= 3:
        return parts[2]
    return None


def sample_ring_ids_by_ccd(ring_ids: list[str], n: int) -> dict[str, list[str]]:
    """
    Group ring_ids by CCD ID and return up to N samples per CCD ID.
    
    Returns:
        dict: {ccd_id: [ring_id1, ring_id2, ...]}
    """
    grouped = defaultdict(list)
    
    # Group by CCD ID
    for rid in ring_ids:
        ccd_id = extract_ccd_id(rid)
        if ccd_id:
            grouped[ccd_id].append(rid)
    
    # Sample up to N for each CCD
    sampled = {ccd: random.sample(rids, min(len(rids), n)) for ccd, rids in grouped.items()}
    return sampled

async def test_ring_pages_async2(ring_ids: dict[str, list[str]]):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        for ccd_id, ring_ids in ring_ids.items():
            print(f"Testing rings with CCD ID: {ccd_id}")
            for ring_id in ring_ids:
                url = APP_URL.format(ring_id)
                print(f"Testing: {url}")

                await page.goto(url, wait_until="networkidle", timeout=60000)
                await asyncio.sleep(5)

                screenshot_path = f"screenshots/{ring_id}.png"
                await page.screenshot(path=screenshot_path)
                print(f"Screenshot saved: {screenshot_path}")

        await browser.close()

async def test_ring_pages_async(data: dict[str, list[str]]):
    print(f"Testing {len(data)} CCD IDs")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        for ccd_id, ring_ids in data.items():
            print(f"Testing rings with CCD ID: {ccd_id}")
            for ring_id in ring_ids:
                url = APP_URL.format(ring_id)
                print(f"Testing ring: {url}")

                await page.goto(url, wait_until="networkidle", timeout=60000)

                LOADING_SPINNER_SELECTOR = "svg.MuiCircularProgress-root" 
                
                try:
                    await asyncio.sleep(1)
                    await page.wait_for_selector(
                        LOADING_SPINNER_SELECTOR, 
                        state="hidden", 
                        timeout=30000
                    )
                except TimeoutError:
                    print(f"Timeout: Molstar viewer failed to load or spinner didn't disappear for {ring_id}.")
                
                await asyncio.sleep(3)
                screenshot_path = f"screenshots/{ring_id}.png"
                await page.screenshot(path=screenshot_path)

        await browser.close()

async def main():
    all_ring_ids = await fetch_all_ring_ids_async()
    sampled_by_ccd = sample_ring_ids_by_ccd(all_ring_ids, n=1)   
     
    await test_ring_pages_async(sampled_by_ccd)


if __name__ == "__main__":
    asyncio.run(main())
