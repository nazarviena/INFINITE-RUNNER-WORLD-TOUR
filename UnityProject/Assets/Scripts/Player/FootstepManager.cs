// =============================================================================
// INFINITE RUNNER: WORLD TOUR - Footstep Manager
// Autor: MagnorioBR | Gerenciamento de sons de passos por superficie
// =============================================================================

using UnityEngine;

namespace InfiniteRunnerWorldTour.Player
{
    public class FootstepManager : MonoBehaviour
    {
        [Header("Footstep Sounds")]
        [SerializeField] private AudioClip[] asphaltSteps;
        [SerializeField] private AudioClip[] concreteSteps;
        [SerializeField] private AudioClip[] grassSteps;
        [SerializeField] private AudioClip[] woodSteps;
        
        [Header("Settings")]
        [SerializeField] private float baseStepInterval = 0.5f;
        [SerializeField] private float sprintStepMultiplier = 0.6f;
        [SerializeField] private float pitchVariation = 0.1f;
        [SerializeField] private float volumeVariation = 0.1f;
        
        [Header("Breathing")]
        [SerializeField] private AudioClip[] breathingClips;
        [SerializeField] private float breathingFadeDistance = 10000f; // 10km
        
        // Internal
        private AudioSource audioSource;
        private AudioSource breathingSource;
        private float stepTimer;
        private FirstPersonController controller;
        private string currentSurface = "asphalt";
        
        void Start()
        {
            audioSource = gameObject.AddComponent<AudioSource>();
            audioSource.spatialBlend = 1f;
            audioSource.rolloffMode = AudioRolloffMode.Linear;
            audioSource.maxDistance = 30f;
            
            breathingSource = gameObject.AddComponent<AudioSource>();
            breathingSource.spatialBlend = 1f;
            breathingSource.loop = true;
            breathingSource.volume = 0f;
            
            controller = GetComponent<FirstPersonController>();
        }
        
        void Update()
        {
            if (controller == null) return;
            
            float speed = controller.GetSpeed();
            
            if (speed > 1f)
            {
                float interval = speed > 8f ? baseStepInterval * sprintStepMultiplier : baseStepInterval;
                stepTimer += Time.deltaTime * (speed / 8f);
                
                if (stepTimer >= interval)
                {
                    stepTimer = 0f;
                    PlayFootstep();
                }
            }
            
            // Breathing intensity based on distance
            float distanceKm = controller.GetDistance() / 1000f;
            float breathingIntensity = Mathf.Clamp01(distanceKm / (breathingFadeDistance / 1000f));
            breathingSource.volume = breathingIntensity * 0.5f;
            
            if (breathingIntensity > 0.1f && !breathingSource.isPlaying)
            {
                breathingSource.clip = GetBreathingClip(breathingIntensity);
                breathingSource.Play();
            }
        }
        
        void PlayFootstep()
        {
            AudioClip[] clips = GetClipsForSurface(currentSurface);
            if (clips == null || clips.Length == 0) return;
            
            AudioClip clip = clips[Random.Range(0, clips.Length)];
            audioSource.pitch = 1f + Random.Range(-pitchVariation, pitchVariation);
            audioSource.volume = Random.Range(1f - volumeVariation, 1f);
            audioSource.PlayOneShot(clip);
        }
        
        AudioClip[] GetClipsForSurface(string surface)
        {
            switch (surface)
            {
                case "asphalt": return asphaltSteps;
                case "concrete": return concreteSteps;
                case "grass": return grassSteps;
                case "wood": return woodSteps;
                default: return asphaltSteps;
            }
        }
        
        AudioClip GetBreathingClip(float intensity)
        {
            if (breathingClips == null || breathingClips.Length == 0) return null;
            
            int index = Mathf.FloorToInt(intensity * (breathingClips.Length - 1));
            return breathingClips[Mathf.Clamp(index, 0, breathingClips.Length - 1)];
        }
        
        public void SetSurface(string surface)
        {
            currentSurface = surface;
        }
    }
}
