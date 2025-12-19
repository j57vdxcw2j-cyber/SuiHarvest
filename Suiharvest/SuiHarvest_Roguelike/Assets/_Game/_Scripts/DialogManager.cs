using UnityEngine;
using TMPro;
using UnityEngine.UI;
using System;
using System.Collections;

public class DialogManager : MonoBehaviour
{
    public static DialogManager instance;

    [Header("Components")]
    public GameObject dialogPanel;
    public TextMeshProUGUI nameText;
    public TextMeshProUGUI contentText;
    public Button yesButton;
    public Button noButton;

    // --- MỚI: Biến để nắm đầu 2 cái dòng chữ trong nút ---
    [Header("Button Labels")]
    public TextMeshProUGUI yesButtonText;
    public TextMeshProUGUI noButtonText;

    [Header("Notification")]
    public TextMeshProUGUI itemNotificationText;

    [Header("Settings")]
    public float typingSpeed = 0.04f;
    public float autoCloseDistance = 3.0f;

    private Coroutine dialogCoroutine;
    private Coroutine notificationCoroutine;
    private Transform playerTransform;
    private Transform currentSpeaker;

    private void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);

        dialogPanel.SetActive(false);
        if (itemNotificationText != null) itemNotificationText.gameObject.SetActive(false);
    }

    private void Start()
    {
        GameObject player = GameObject.FindGameObjectWithTag("Player");
        if (player != null) playerTransform = player.transform;
    }

    private void Update()
    {
        if (dialogPanel.activeSelf && currentSpeaker != null && playerTransform != null)
        {
            if (Vector3.Distance(playerTransform.position, currentSpeaker.position) > autoCloseDistance)
            {
                CloseDialog();
            }
        }
    }

    public void ShowDialog(string name, string content, Transform speaker)
    {
        if (dialogCoroutine != null) StopCoroutine(dialogCoroutine);
        currentSpeaker = speaker;
        dialogPanel.SetActive(true);
        nameText.text = name;
        dialogCoroutine = StartCoroutine(TypeContent(content));
        yesButton.gameObject.SetActive(false);
        noButton.gameObject.SetActive(false);
    }

    // --- HÀM QUAN TRỌNG NHẤT: Thêm 2 tham số chỉnh chữ ở cuối ---
    public void ShowChoiceDialog(string name, string content, Action onYes, Action onNo, Transform speaker, string yesLabel = "Yes", string noLabel = "No")
    {
        if (dialogCoroutine != null) StopCoroutine(dialogCoroutine);

        currentSpeaker = speaker;
        dialogPanel.SetActive(true);
        nameText.text = name;

        // Thay đổi nội dung chữ trên nút
        if (yesButtonText != null) yesButtonText.text = yesLabel;
        if (noButtonText != null) noButtonText.text = noLabel;

        dialogCoroutine = StartCoroutine(TypeContent(content, true));

        yesButton.gameObject.SetActive(false);
        noButton.gameObject.SetActive(false);

        yesButton.onClick.RemoveAllListeners();
        yesButton.onClick.AddListener(() => { onYes?.Invoke(); CloseDialog(); });

        noButton.onClick.RemoveAllListeners();
        noButton.onClick.AddListener(() => { onNo?.Invoke(); CloseDialog(); });
    }

    // --- Phần dưới này giữ nguyên ---
    public void CloseDialog()
    {
        if (dialogCoroutine != null) StopCoroutine(dialogCoroutine);
        dialogPanel.SetActive(false);
        currentSpeaker = null;
    }

    public void ShowItemNotification(string message)
    {
        if (notificationCoroutine != null) StopCoroutine(notificationCoroutine);
        notificationCoroutine = StartCoroutine(AnimateNotification(message));
    }

    IEnumerator AnimateNotification(string message)
    {
        itemNotificationText.gameObject.SetActive(true);
        itemNotificationText.text = message;
        itemNotificationText.alpha = 1;
        yield return new WaitForSeconds(15f);
        float fadeDuration = 1f;
        float timer = 0;
        while (timer < fadeDuration)
        {
            timer += Time.deltaTime;
            itemNotificationText.alpha = Mathf.Lerp(1, 0, timer / fadeDuration);
            yield return null;
        }
        itemNotificationText.gameObject.SetActive(false);
    }

    IEnumerator TypeContent(string content, bool showButtons = false)
    {
        contentText.text = "";
        foreach (char letter in content.ToCharArray())
        {
            contentText.text += letter;
            yield return new WaitForSeconds(typingSpeed);
        }
        if (showButtons)
        {
            yesButton.gameObject.SetActive(true);
            noButton.gameObject.SetActive(true);
        }
    }
}