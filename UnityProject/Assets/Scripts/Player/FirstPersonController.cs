// =============================================================================
// INFINITE RUNNER: WORLD TOUR - First Person Controller
// Autor: MagnorioBR | Unity C# | HDRP
// =============================================================================

using UnityEngine;

namespace InfiniteRunnerWorldTour.Player
{
    [RequireComponent(typeof(CharacterController))]
    public class FirstPersonController : MonoBehaviour
    {
        [Header("Movement")]
        [SerializeField] private float baseSpeed = 8f;
        [SerializeField] private float sprintSpeed = 14f;
        [SerializeField] private float lateralSpeed = 5f;
        [SerializeField] private float deceleration = 2f;
        
        [Header("Stamina")]
        [SerializeField] private float maxStamina = 100f;
        [SerializeField] private float staminaDrain = 25f;
        [SerializeField] private float staminaRegen = 15f;
        
        [Header("Jump")]
        [SerializeField] private float jumpForce = 5f;
        [SerializeField] private float gravity = 9.8f;
        
        [Header("Headbob")]
        [SerializeField] private float headbobAmplitude = 0.04f;
        [SerializeField] private float headbobFrequency = 2.5f;
        [SerializeField] private float cameraHeight = 1.70f;
        
        [Header("References")]
        [SerializeField] private Camera playerCamera;
        
        // Private
        private CharacterController controller;
        private float currentSpeed;
        private float targetSpeed;
        private float lateralOffset;
        private float targetLateral;
        private float stamina;
        private float verticalVelocity;
        private float headbobTimer;
        private float distanceTraveled;
        private bool isGrounded;
        private bool isSprinting;
        
        // Events
        public System.Action<float> OnDistanceUpdated;
        public System.Action<float> OnStaminaChanged;
        public System.Action OnGameOver;
        
        void Start()
        {
            controller = GetComponent<CharacterController>();
            stamina = maxStamina;
            
            if (playerCamera == null)
                playerCamera = GetComponentInChildren<Camera>();
            
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }
        
        void Update()
        {
            HandleInput();
            UpdateMovement();
            UpdateStamina();
            UpdateHeadbob();
            UpdateCamera();
            CheckCollisions();
            
            OnDistanceUpdated?.Invoke(distanceTraveled);
            OnStaminaChanged?.Invoke(stamina / maxStamina);
        }
        
        void HandleInput()
        {
            // Forward/backward
            if (Input.GetKey(KeyCode.W))
            {
                targetSpeed = isSprinting && stamina > 0 ? sprintSpeed : baseSpeed;
            }
            else if (Input.GetKey(KeyCode.S))
            {
                targetSpeed = Mathf.Max(0, currentSpeed - deceleration * Time.deltaTime);
            }
            else
            {
                targetSpeed = Mathf.Max(0, currentSpeed - deceleration * Time.deltaTime);
            }
            
            // Sprint
            isSprinting = Input.GetKey(KeyCode.LeftShift) && Input.GetKey(KeyCode.W);
            
            // Lateral
            if (Input.GetKey(KeyCode.A))
                targetLateral = -3f;
            else if (Input.GetKey(KeyCode.D))
                targetLateral = 3f;
            else
                targetLateral = 0f;
            
            // Jump
            if (Input.GetKeyDown(KeyCode.Space) && isGrounded)
            {
                verticalVelocity = jumpForce;
                isGrounded = false;
            }
        }
        
        void UpdateMovement()
        {
            // Smooth speed
            currentSpeed = Mathf.Lerp(currentSpeed, targetSpeed, 5f * Time.deltaTime);
            
            // Lateral
            lateralOffset = Mathf.Lerp(lateralOffset, targetLateral, 8f * Time.deltaTime);
            
            // Gravity
            if (!isGrounded)
            {
                verticalVelocity -= gravity * Time.deltaTime;
            }
            
            // Move
            Vector3 move = new Vector3(lateralOffset, verticalVelocity, currentSpeed) * Time.deltaTime;
            
            controller.Move(move);
            
            // Ground check
            isGrounded = controller.isGrounded;
            if (isGrounded && verticalVelocity < 0)
                verticalVelocity = 0f;
            
            // Distance
            distanceTraveled += currentSpeed * Time.deltaTime;
        }
        
        void UpdateStamina()
        {
            if (isSprinting && currentSpeed > baseSpeed)
            {
                stamina = Mathf.Max(0, stamina - staminaDrain * Time.deltaTime);
                if (stamina <= 0) isSprinting = false;
            }
            else
            {
                stamina = Mathf.Min(maxStamina, stamina + staminaRegen * Time.deltaTime);
            }
        }
        
        void UpdateHeadbob()
        {
            if (currentSpeed > 1f)
            {
                headbobTimer += Time.deltaTime * headbobFrequency * (currentSpeed / baseSpeed);
            }
        }
        
        void UpdateCamera()
        {
            float bobY = Mathf.Sin(headbobTimer * Mathf.PI * 2) * headbobAmplitude * 
                         Mathf.Min(currentSpeed / baseSpeed, 1.5f);
            float bobX = Mathf.Cos(headbobTimer * Mathf.PI) * headbobAmplitude * 0.5f;
            
            Vector3 camPos = playerCamera.transform.localPosition;
            camPos.x = bobX;
            camPos.y = cameraHeight + bobY;
            playerCamera.transform.localPosition = camPos;
        }
        
        void CheckCollisions()
        {
            // Simple collision handling is done via CharacterController
            // Additional damage logic
            if ((controller.collisionFlags & CollisionFlags.Sides) != 0)
            {
                currentSpeed *= 0.7f;
                // Trigger damage effect
            }
        }
        
        public float GetDistance() => distanceTraveled;
        public float GetSpeed() => currentSpeed;
        public float GetStaminaPercent() => stamina / maxStamina;
    }
}
