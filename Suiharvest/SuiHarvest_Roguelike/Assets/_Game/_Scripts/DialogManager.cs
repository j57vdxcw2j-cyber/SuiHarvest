using UnityEngine;
using TMPro; // Thư viện chữ đẹp
using UnityEngine.UI; // Thư viện nút bấm
using System; // Thư viện để xử lý hành động (Action)

public class DialogManager : MonoBehaviour
{
    public static DialogManager instance; // Singleton để gọi từ khắp nơi

    [Header("Kéo UI vào các ô bên dưới:")]
    public GameObject dialogPanel;        // Cái bảng nâu
    public TextMeshProUGUI nameText;      // Chỗ hiện tên
    public TextMeshProUGUI contentText;   // Chỗ hiện nội dung
    public Button yesButton;              // Nút Yes
    public Button noButton;               // Nút No

    private void Awake()
    {
        // Đảm bảo chỉ có 1 Manager duy nhất
        if (instance == null) instance = this;
        else Destroy(gameObject);

        // Tắt bảng hội thoại ngay khi vào game
        dialogPanel.SetActive(false);
    }

    // 1. Hàm hiện hội thoại thường (Than, Lửa)
    public void ShowDialog(string name, string content)
    {
        dialogPanel.SetActive(true);
        nameText.text = name;
        contentText.text = content;

        // Tắt 2 nút chọn đi
        yesButton.gameObject.SetActive(false);
        noButton.gameObject.SetActive(false);
    }

    // 2. Hàm hiện hội thoại CÓ LỰA CHỌN (Trader)
    public void ShowChoiceDialog(string name, string content, Action onYes, Action onNo)
    {
        dialogPanel.SetActive(true);
        nameText.text = name;
        contentText.text = content;

        // Bật 2 nút lên
        yesButton.gameObject.SetActive(true);
        noButton.gameObject.SetActive(true);

        // -- Cài đặt nút YES --
        yesButton.onClick.RemoveAllListeners(); // Xóa lệnh cũ
        yesButton.onClick.AddListener(() => {
            onYes?.Invoke();  // Chạy lệnh đồng ý
            CloseDialog();    // Tắt bảng
        });

        // -- Cài đặt nút NO --
        noButton.onClick.RemoveAllListeners();
        noButton.onClick.AddListener(() => {
            onNo?.Invoke();   // Chạy lệnh từ chối
            CloseDialog();    // Tắt bảng
        });
    }

    public void CloseDialog()
    {
        dialogPanel.SetActive(false);
    }
}