using UnityEngine;
using System.Collections;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 5f;

    private Rigidbody2D rb;
    private Animator animator;
    private SpriteRenderer sr; // <--- 1. THÊM BIẾN NÀY

    private Vector2 movement;
    private bool canMove = true;

    private float lastMoveX = 0f;
    private float lastMoveY = -1f;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        animator = GetComponent<Animator>();
        sr = GetComponent<SpriteRenderer>(); // <--- 2. LẤY COMPONENT RA
    }

    void Update()
    {
        if (!canMove)
        {
            rb.velocity = Vector2.zero;
            return;
        }

        movement.x = Input.GetAxisRaw("Horizontal");
        movement.y = Input.GetAxisRaw("Vertical");

        // --- 3. ĐOẠN CODE LẬT MẶT (CHÈN VÀO ĐÂY) ---
        // Nếu đi sang Phải (x > 0) -> Không lật
        if (movement.x > 0)
        {
            sr.flipX = false;
        }
        // Nếu đi sang Trái (x < 0) -> Lật ngược lại
        else if (movement.x < 0)
        {
            sr.flipX = true;
        }
        // ---------------------------------------------

        animator.SetFloat("Horizontal", movement.x);
        animator.SetFloat("Vertical", movement.y);
        animator.SetFloat("Speed", movement.sqrMagnitude);

        if (movement != Vector2.zero)
        {
            lastMoveX = movement.x;
            lastMoveY = movement.y;

            animator.SetFloat("LastMoveX", lastMoveX);
            animator.SetFloat("LastMoveY", lastMoveY);
        }

        if (Input.GetKeyDown(KeyCode.E))
        {
            StartCoroutine(InteractRoutine());
        }
    }

    // ... (Phần dưới giữ nguyên không đổi)
    void FixedUpdate() { if (canMove) rb.MovePosition(rb.position + movement * moveSpeed * Time.fixedDeltaTime); }
    IEnumerator InteractRoutine()
    {
        // ... (Code cũ giữ nguyên) ... 
        yield return null; // (Dòng này để chống lỗi compile nếu ông copy paste thiếu)
    }
}