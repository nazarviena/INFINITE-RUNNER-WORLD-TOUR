// =============================================================================
// INFINITE RUNNER: WORLD TOUR - Stamina System
// Autor: MagnorioBR
// =============================================================================

using UnityEngine;
using UnityEngine.Events;

namespace InfiniteRunnerWorldTour.Player
{
    [System.Serializable]
    public class StaminaEvent : UnityEvent<float> { }
    
    public class StaminaSystem : MonoBehaviour
    {
        [Header("Stamina Settings")]
        [SerializeField] private float maxStamina = 100f;
        [SerializeField] private float sprintDrain = 25f;       // per second
        [SerializeField] private float regenRate = 15f;          // per second
        [SerializeField] private float regenDelay = 1f;          // seconds after sprint
        
        [Header("Exhaustion")]
        [SerializeField] private float exhaustionThreshold = 0f; // 0 = can't sprint at 0
        [SerializeField] private float exhaustionPenalty = 0.5f; // speed multiplier
        
        // Events
        public StaminaEvent OnStaminaChanged;
        public UnityEvent OnExhausted;
        public UnityEvent OnRecovered;
        
        // State
        private float currentStamina;
        private float regenTimer;
        private bool isExhausted;
        private bool isSprinting;
        
        public float StaminaPercent => currentStamina / maxStamina;
        public bool IsExhausted => isExhausted;
        public bool CanSprint => currentStamina > exhaustionThreshold && !isExhausted;
        
        void Start()
        {
            currentStamina = maxStamina;
        }
        
        void Update()
        {
            if (isSprinting && currentStamina > 0)
            {
                // Drain stamina
                currentStamina = Mathf.Max(0, currentStamina - sprintDrain * Time.deltaTime);
                regenTimer = 0f;
                
                if (currentStamina <= exhaustionThreshold)
                {
                    isExhausted = true;
                    OnExhausted?.Invoke();
                }
            }
            else
            {
                // Regeneration delay
                regenTimer += Time.deltaTime;
                
                if (regenTimer >= regenDelay)
                {
                    currentStamina = Mathf.Min(maxStamina, currentStamina + regenRate * Time.deltaTime);
                    
                    if (isExhausted && currentStamina > maxStamina * 0.3f)
                    {
                        isExhausted = false;
                        OnRecovered?.Invoke();
                    }
                }
            }
            
            OnStaminaChanged?.Invoke(StaminaPercent);
        }
        
        public void SetSprinting(bool sprinting)
        {
            isSprinting = sprinting;
        }
        
        public float GetSpeedMultiplier()
        {
            if (isExhausted) return exhaustionPenalty;
            return 1f;
        }
    }
}
