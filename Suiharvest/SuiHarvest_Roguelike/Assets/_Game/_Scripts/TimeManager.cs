using UnityEngine;
using System.Collections.Generic;
using UnityEngine.UI;
using System.Collections;
using TMPro;

public class TimeManager : MonoBehaviour
{
    public static TimeManager instance;

    [Header("UI Components")]
    public Image blackScreenPanel;
    public TextMeshProUGUI dayText;

    [Header("Settings")]
    public int currentDay = 1;

    // Danh sách quản lý
    private List<Crop> allCrops = new List<Crop>();
    private List<ResourceObject> allResources = new List<ResourceObject>(); // <--- MỚI

    private void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }

    private void Start()
    {
        UpdateDayUI();
        if (blackScreenPanel != null)
        {
            blackScreenPanel.gameObject.SetActive(true);
            Color c = blackScreenPanel.color;
            c.a = 0;
            blackScreenPanel.color = c;
            blackScreenPanel.raycastTarget = false;
        }
    }

    public void RegisterCrop(Crop crop)
    {
        if (!allCrops.Contains(crop)) allCrops.Add(crop);
    }

    // --- MỚI: Hàm đăng ký Tài nguyên ---
    public void RegisterResource(ResourceObject res)
    {
        if (!allResources.Contains(res))
        {
            allResources.Add(res);
        }
    }

    public void SleepAndNextDay()
    {
        StartCoroutine(SleepSequence());
    }

    IEnumerator SleepSequence()
    {
        // 1. Tối màn hình
        yield return StartCoroutine(FadeScreen(0, 1, 1f));

        // 2. Qua ngày mới
        currentDay++;
        UpdateDayUI();

        // Hồi đầy stamina
        if (GameBridge.instance != null)
        {
            GameBridge.instance.currentStamina = GameBridge.instance.maxStamina;
            GameBridge.NotifyStaminaChanged(GameBridge.instance.currentStamina, GameBridge.instance.maxStamina);
            Debug.Log("[TimeManager] Stamina restored to full!");
        }

        // Thông báo lên web portal
        GameBridge.NotifyDayStarted(currentDay);

        // --- XỬ LÝ CÂY TRỒNG (Lớn lên) ---
        foreach (Crop crop in allCrops)
        {
            crop.Regrow();
        }

        // --- MỚI: XỬ LÝ TÀI NGUYÊN (Mọc lại) ---
        foreach (ResourceObject res in allResources)
        {
            res.RespawnResource();
        }

        yield return new WaitForSeconds(1f);

        // 3. Sáng màn hình
        yield return StartCoroutine(FadeScreen(1, 0, 1f));
    }

    IEnumerator FadeScreen(float startAlpha, float endAlpha, float duration)
    {
        if (blackScreenPanel == null) yield break;

        float timer = 0;
        Color c = blackScreenPanel.color;
        blackScreenPanel.raycastTarget = true;

        while (timer < duration)
        {
            timer += Time.deltaTime;
            c.a = Mathf.Lerp(startAlpha, endAlpha, timer / duration);
            blackScreenPanel.color = c;
            yield return null;
        }

        c.a = endAlpha;
        blackScreenPanel.color = c;
        if (endAlpha == 0) blackScreenPanel.raycastTarget = false;
    }

    void UpdateDayUI()
    {
        if (dayText != null) dayText.text = "Day " + currentDay;
    }
}