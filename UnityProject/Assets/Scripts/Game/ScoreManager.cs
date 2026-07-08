// =============================================================================
// INFINITE RUNNER: WORLD TOUR - Exponential Score Manager
// Autor: MagnorioBR | Sistema de pontuacao exponencial
// =============================================================================

using UnityEngine;
using System.Collections.Generic;

namespace InfiniteRunnerWorldTour.Game
{
    public class ScoreManager : MonoBehaviour
    {
        [Header("Score Settings")]
        [SerializeField] private float startMilestoneKm = 1f;
        
        // Events
        public System.Action<float> OnMilestoneReached;
        public System.Action<float, float> OnDistanceUpdated;
        
        // Data
        private float distanceMeters;
        private float nextMilestone;
        private List<float> milestonesReached = new List<float>();
        private float bestDistance;
        private float bestMilestone;
        
        // Properties
        public float DistanceKm => distanceMeters / 1000f;
        public float NextMilestone => nextMilestone;
        public List<float> MilestonesReached => milestonesReached;
        
        void Start()
        {
            LoadRecords();
            nextMilestone = startMilestoneKm;
        }
        
        public void UpdateDistance(float newDistance)
        {
            distanceMeters = newDistance;
            float distanceKm = distanceMeters / 1000f;
            
            // Check milestones
            while (distanceKm >= nextMilestone)
            {
                float milestone = nextMilestone;
                milestonesReached.Add(milestone);
                
                // Update best
                if (milestone > bestMilestone)
                {
                    bestMilestone = milestone;
                    SaveRecords();
                }
                
                // Fire event
                OnMilestoneReached?.Invoke(milestone);
                
                // Double for next
                nextMilestone *= 2f;
            }
            
            // Update best distance
            if (distanceKm > bestDistance)
            {
                bestDistance = distanceKm;
                SaveRecords();
            }
            
            OnDistanceUpdated?.Invoke(distanceKm, nextMilestone);
        }
        
        void LoadRecords()
        {
            bestDistance = PlayerPrefs.GetFloat("IRWT_BestDistance", 0f);
            bestMilestone = PlayerPrefs.GetFloat("IRWT_BestMilestone", 0f);
        }
        
        void SaveRecords()
        {
            PlayerPrefs.SetFloat("IRWT_BestDistance", bestDistance);
            PlayerPrefs.SetFloat("IRWT_BestMilestone", bestMilestone);
            PlayerPrefs.Save();
        }
        
        public float GetBestDistance() => bestDistance;
        public float GetBestMilestone() => bestMilestone;
    }
}
