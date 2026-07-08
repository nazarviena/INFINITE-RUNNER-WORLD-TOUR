// =============================================================================
// INFINITE RUNNER: WORLD TOUR - City Generator
// Autor: MagnorioBR | Geracao procedural de cidades
// =============================================================================

using UnityEngine;
using System.Collections.Generic;

namespace InfiniteRunnerWorldTour.World
{
    public class CityGenerator : MonoBehaviour
    {
        [Header("Block Settings")]
        [SerializeField] private float blockSize = 100f;
        [SerializeField] private float roadWidth = 10f;
        [SerializeField] private float sidewalkWidth = 3f;
        [SerializeField] private int viewDistanceBlocks = 4;
        
        [Header("Building Settings")]
        [SerializeField] private float buildingMinHeight = 8f;
        [SerializeField] private float buildingMaxHeight = 40f;
        
        [Header("Prefabs")]
        [SerializeField] private GameObject cityBlockPrefab;
        [SerializeField] private GameObject[] treePrefabs;
        [SerializeField] private GameObject[] buildingPrefabs;
        [SerializeField] private GameObject[] furniturePrefabs;
        
        [Header("References")]
        [SerializeField] private Transform playerTransform;
        
        // Internal
        private Dictionary<Vector2Int, GameObject> activeBlocks = new Dictionary<Vector2Int, GameObject>();
        private Queue<GameObject> blockPool = new Queue<GameObject>();
        private int lastPlayerBlockZ;
        
        void Start()
        {
            if (playerTransform == null)
                playerTransform = Camera.main?.transform;
            
            // Pre-warm pool
            for (int i = 0; i < 10; i++)
            {
                GameObject block = Instantiate(cityBlockPrefab);
                block.SetActive(false);
                blockPool.Enqueue(block);
            }
        }
        
        void Update()
        {
            if (playerTransform == null) return;
            
            int playerBZ = Mathf.FloorToInt(playerTransform.position.z / blockSize);
            
            if (playerBZ != lastPlayerBlockZ)
            {
                lastPlayerBlockZ = playerBZ;
                UpdateBlocks(playerBZ);
            }
        }
        
        void UpdateBlocks(int playerBZ)
        {
            int range = viewDistanceBlocks;
            
            // Blocks to keep
            HashSet<Vector2Int> neededBlocks = new HashSet<Vector2Int>();
            for (int bz = playerBZ - range; bz <= playerBZ + range; bz++)
            {
                for (int bx = -2; bx <= 2; bx++)
                {
                    neededBlocks.Add(new Vector2Int(bx, bz));
                }
            }
            
            // Remove distant blocks
            List<Vector2Int> toRemove = new List<Vector2Int>();
            foreach (var kvp in activeBlocks)
            {
                if (!neededBlocks.Contains(kvp.Key))
                    toRemove.Add(kvp.Key);
            }
            
            foreach (var key in toRemove)
            {
                activeBlocks[key].SetActive(false);
                blockPool.Enqueue(activeBlocks[key]);
                activeBlocks.Remove(key);
            }
            
            // Create new blocks
            foreach (var key in neededBlocks)
            {
                if (!activeBlocks.ContainsKey(key))
                {
                    GameObject block = GetBlockFromPool();
                    block.transform.position = new Vector3(key.x * blockSize, 0, key.y * blockSize);
                    block.SetActive(true);
                    
                    // Populate block
                    PopulateBlock(block, key.x, key.y);
                    
                    activeBlocks[key] = block;
                }
            }
        }
        
        GameObject GetBlockFromPool()
        {
            if (blockPool.Count > 0)
                return blockPool.Dequeue();
            return Instantiate(cityBlockPrefab);
        }
        
        void PopulateBlock(GameObject block, int bx, int bz)
        {
            int seed = HashBlock(bx, bz);
            System.Random rng = new System.Random(seed);
            
            // Generate buildings
            float bldgZoneStart = roadWidth / 2f + sidewalkWidth;
            float bldgZoneWidth = (blockSize / 2f) - bldgZoneStart;
            
            for (int side = -1; side <= 1; side += 2)
            {
                float bldgX = side * (bldgZoneStart + bldgZoneWidth / 2f);
                int numBuildings = 2 + rng.Next(0, 2);
                float bldgWidth = (blockSize - 4f) / numBuildings;
                
                for (int b = 0; b < numBuildings; b++)
                {
                    float bzPos = -blockSize/2f + 2f + b * bldgWidth + bldgWidth/2f;
                    float height = buildingMinHeight + (float)rng.NextDouble() * (buildingMaxHeight - buildingMinHeight);
                    
                    if (buildingPrefabs.Length > 0)
                    {
                        GameObject bldg = Instantiate(buildingPrefabs[rng.Next(buildingPrefabs.Length)], block.transform);
                        bldg.transform.localPosition = new Vector3(bldgX, height/2f, bzPos);
                        bldg.transform.localScale = new Vector3(bldgZoneWidth - 0.2f, height, bldgWidth - 0.5f);
                    }
                }
            }
            
            // Generate trees
            if (treePrefabs.Length > 0)
            {
                for (int side = -1; side <= 1; side += 2)
                {
                    float treeX = side * (roadWidth/2f + sidewalkWidth/2f);
                    for (float tz = -blockSize/2f + 5f; tz < blockSize/2f - 5f; tz += 15f + (float)rng.NextDouble() * 10f)
                    {
                        GameObject tree = Instantiate(treePrefabs[rng.Next(treePrefabs.Length)], block.transform);
                        tree.transform.localPosition = new Vector3(treeX, 0, tz);
                        tree.transform.localScale = Vector3.one * (0.8f + (float)rng.NextDouble() * 1.2f);
                    }
                }
            }
        }
        
        int HashBlock(int bx, int bz)
        {
            int h = bx * 374761393 + bz * 668265263;
            h = (h ^ (h >> 13)) * 1274126177;
            return h ^ (h >> 16);
        }
    }
}
