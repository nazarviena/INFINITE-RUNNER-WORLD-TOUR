// =============================================================================
// INFINITE RUNNER: WORLD TOUR - Object Pool
// Autor: MagnorioBR | Reutilizacao de GameObjects
// =============================================================================

using UnityEngine;
using System.Collections.Generic;

namespace InfiniteRunnerWorldTour.Utilities
{
    [System.Serializable]
    public class PoolItem
    {
        public GameObject prefab;
        public int initialSize = 5;
        public int maxSize = 20;
    }
    
    public class ObjectPool : MonoBehaviour
    {
        [SerializeField] private PoolItem[] poolItems;
        
        private Dictionary<GameObject, Queue<GameObject>> pools;
        
        void Awake()
        {
            pools = new Dictionary<GameObject, Queue<GameObject>>();
            InitializePools();
        }
        
        void InitializePools()
        {
            foreach (var item in poolItems)
            {
                if (item.prefab == null) continue;
                
                Queue<GameObject> pool = new Queue<GameObject>();
                
                for (int i = 0; i < item.initialSize; i++)
                {
                    GameObject obj = CreateNew(item.prefab);
                    pool.Enqueue(obj);
                }
                
                pools[item.prefab] = pool;
            }
        }
        
        GameObject CreateNew(GameObject prefab)
        {
            GameObject obj = Instantiate(prefab);
            obj.SetActive(false);
            obj.transform.SetParent(transform);
            return obj;
        }
        
        public GameObject Get(GameObject prefab)
        {
            if (!pools.ContainsKey(prefab))
            {
                pools[prefab] = new Queue<GameObject>();
            }
            
            Queue<GameObject> pool = pools[prefab];
            
            if (pool.Count > 0)
            {
                GameObject obj = pool.Dequeue();
                obj.SetActive(true);
                return obj;
            }
            
            // Expand pool if needed
            foreach (var item in poolItems)
            {
                if (item.prefab == prefab && pool.Count < item.maxSize)
                {
                    return CreateNew(prefab);
                }
            }
            
            return CreateNew(prefab);
        }
        
        public void Return(GameObject prefab, GameObject obj)
        {
            obj.SetActive(false);
            obj.transform.SetParent(transform);
            
            if (!pools.ContainsKey(prefab))
            {
                pools[prefab] = new Queue<GameObject>();
            }
            
            pools[prefab].Enqueue(obj);
        }
        
        public void Prewarm(GameObject prefab, int count)
        {
            if (!pools.ContainsKey(prefab))
            {
                pools[prefab] = new Queue<GameObject>();
            }
            
            for (int i = 0; i < count; i++)
            {
                pools[prefab].Enqueue(CreateNew(prefab));
            }
        }
    }
}
