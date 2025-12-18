using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [Header("Cài đặt chung")]
    public float moveSpeed = 5f;

    [Header("Kéo Component vào đây")]
    public Rigidbody2D rb;
    public Animator animator; // <-- Quan trọng: Phải kéo Animator vào ô này trong Inspector

    private Vector2 movement;

    void Update()
    {
        // 1. Nhận nút bấm (WASD hoặc Mũi tên)
        movement.x = Input.GetAxisRaw("Horizontal");
        movement.y = Input.GetAxisRaw("Vertical");

        // 2. Xử lý Animation
        // Kiểm tra xem nhân vật có đang di chuyển không (độ dài vector > 0)
        if (movement.sqrMagnitude > 0)
        {
            // Gửi thông số hướng đi cho Animator
            animator.SetFloat("Horizontal", movement.x);
            animator.SetFloat("Vertical", movement.y);

            // Bật trạng thái "Đang chạy" -> Chuyển sang Blend Tree Walking
            animator.SetBool("IsMoving", true);

            // --- XỬ LÝ LẬT HÌNH (FLIP) ---
            // Vì ông dùng chung Animation "Walk_Side" cho cả 2 bên
            if (movement.x > 0)
            {
                // Đi sang Phải: Giữ nguyên
                transform.localScale = new Vector3(1, 1, 1);
            }
            else if (movement.x < 0)
            {
                // Đi sang Trái: Lật ngược trục X lại
                transform.localScale = new Vector3(-1, 1, 1);
            }
        }
        else
        {
            // Tắt trạng thái chạy -> Về đứng yên (Idle)
            animator.SetBool("IsMoving", false);
        }
    }

    void FixedUpdate()
    {
        // 3. Di chuyển vật lý (Mượt mà và không xuyên tường)
        rb.MovePosition(rb.position + movement.normalized * moveSpeed * Time.fixedDeltaTime);
    }
}