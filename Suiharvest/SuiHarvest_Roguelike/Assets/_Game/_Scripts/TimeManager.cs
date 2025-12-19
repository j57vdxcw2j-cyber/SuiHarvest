using UnityEngine;
using System.Collections.Generic; // Để dùng List
using UnityEngine.UI; // Để chỉnh màn hình đen
using System.Collections;
using TMPro; // Để hiện số ngày

public class TimeManager : MonoBehaviour
{
    public static TimeManager instance;

    [Header("UI Components")]
    public Image blackScreenPanel; // Tấm màn đen che màn hình
    public TextMeshProUGUI dayText; // Chữ hiện "Day 1"

    [Header("Settings")]
    public int currentDay = 1;

    // Danh sách chứa tất cả các cây trong map
    private List<Crop> allCrops = new List<Crop>();

    private void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }

    private void Start()
    {
        UpdateDayUI();

        // Đảm bảo lúc đầu màn hình sáng
        if (blackScreenPanel != null)
        {
            blackScreenPanel.gameObject.SetActive(true);
            Color c = blackScreenPanel.color;
            c.a = 0; // Trong suốt hoàn toàn
            blackScreenPanel.color = c;
            blackScreenPanel.raycastTarget = false; // Để chuột bấm xuyên qua được
        }
    }

    // Hàm để cây tự đăng ký vào danh sách (được gọi từ Crop.cs)
    public void RegisterCrop(Crop crop)
    {
        if (!allCrops.Contains(crop))
        {
            allCrops.Add(crop);
        }
    }

    // --- HÀM NGỦ (Gọi khi bấm E vào giường/nhà) ---
    public void SleepAndNextDay()
    {
        StartCoroutine(SleepSequence());
    }

    IEnumerator SleepSequence()
    {
        // 1. Màn hình tối dần (Fade In)
        yield return StartCoroutine(FadeScreen(0, 1, 1f));

        // 2. Xử lý logic qua ngày
        currentDay++;
        UpdateDayUI();
        Debug.Log("Good Morning! Day " + currentDay);

        // --- CÂY MỌC LẠI Ở ĐÂY ---
        foreach (Crop crop in allCrops)
        {
            // Ra lệnh cho từng cây mọc lại
            crop.Regrow();
        }

        // 3. Chờ 1 giây trong bóng tối
        yield return new WaitForSeconds(1f);

        // 4. Màn hình sáng dần (Fade Out)
        yield return StartCoroutine(FadeScreen(1, 0, 1f));
    }

    IEnumerator FadeScreen(float startAlpha, float endAlpha, float duration)
    {
        if (blackScreenPanel == null) yield break;

        float timer = 0;
        Color c = blackScreenPanel.color;
        blackScreenPanel.raycastTarget = true; // Chặn chuột khi đang chuyển cảnh

        while (timer < duration)
        {
            timer += Time.deltaTime;
            c.a = Mathf.Lerp(startAlpha, endAlpha, timer / duration);
            blackScreenPanel.color = c;
            yield return null;
        }

        c.a = endAlpha;
        blackScreenPanel.color = c;

        if (endAlpha == 0) blackScreenPanel.raycastTarget = false; // Mở lại chuột khi sáng hẳn
    }

    void UpdateDayUI()
    {
        if (dayText != null)
        {
            dayText.text = "Day " + currentDay;
        }
    }
}