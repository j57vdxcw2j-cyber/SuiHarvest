using UnityEngine;
using System.Collections;

public class Crop : MonoBehaviour, IInteractable
{
    [Header("Cài đặt cây trồng")]
    public string cropName = "Carrot";
    public Sprite ripeSprite;

    private bool isHarvested = false;
    private SpriteRenderer sr;
    private Collider2D col;

    void Start()
    {
        sr = GetComponent<SpriteRenderer>();
        col = GetComponent<Collider2D>();

        if (ripeSprite != null) sr.sprite = ripeSprite;
    }

    // --- Code Test nhanh (Xóa đi khi làm xong game) ---
    void Update()
    {
        // Bấm phím K để test thử hiệu ứng mọc cây ngay lập tức
        if (Input.GetKeyDown(KeyCode.K) && isHarvested)
        {
            Regrow();
        }
    }
    // --------------------------------------------------

    public void Interact()
    {
        if (!isHarvested)
        {
            Harvest();
        }
    }

    void Harvest()
    {
        // 1. Hiện thông báo
        if (DialogManager.instance != null)
        {
            DialogManager.instance.ShowItemNotification("+1 " + cropName);
        }

        // 2. Ẩn cây đi
        isHarvested = true;
        sr.enabled = false;
        col.enabled = false;
    }

    // Hàm gọi cây mọc lại (Kèm hiệu ứng Animation)
    public void Regrow()
    {
        StartCoroutine(GrowAnimation());
    }

    IEnumerator GrowAnimation()
    {
        // 1. Reset trạng thái
        isHarvested = false;
        sr.enabled = true;
        col.enabled = true;

        // 2. Bắt đầu từ tí hon (Scale = 0)
        transform.localScale = Vector3.zero;

        // 3. Phình to dần lên trong 1 giây
        float duration = 1f; // Thời gian mọc
        float timer = 0f;

        // Hiệu ứng nảy (Elastic) nhẹ
        while (timer < duration)
        {
            timer += Time.deltaTime;
            float progress = timer / duration;

            // Lerp từ 0 lên 1 (Kích thước chuẩn)
            float scale = Mathf.Lerp(0f, 1f, progress);
            transform.localScale = new Vector3(scale, scale, 1f);

            yield return null;
        }

        // Đảm bảo kết thúc ở kích thước chuẩn
        transform.localScale = Vector3.one;
    }
}