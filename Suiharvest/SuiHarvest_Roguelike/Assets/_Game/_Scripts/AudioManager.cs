using UnityEngine;

public class AudioManager : MonoBehaviour
{
    public static AudioManager instance;

    [Header("Components")]
    public AudioSource musicSource; // Cái loa để phát nhạc nền

    [Header("Music Clips")]
    public AudioClip backgroundMusic; // File nhạc mp3

    void Awake()
    {
        // Singleton: Đảm bảo chỉ có 1 AudioManager duy nhất tồn tại
        if (instance == null)
        {
            instance = this;
            // Giữ cho nhạc không bị ngắt khi ông chuyển cảnh (sau này làm vào nhà/ra vườn)
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    void Start()
    {
        // Mới vào game là chơi nhạc luôn
        PlayMusic(backgroundMusic);
    }

    public void PlayMusic(AudioClip clip)
    {
        if (clip != null)
        {
            musicSource.clip = clip;
            musicSource.Play();
        }
    }
}