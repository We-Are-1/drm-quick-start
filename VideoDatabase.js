(function () {
    "use strict";

    let allVideos = [
        
        {
            "name": "1. giam stress CEO",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/XGkXGz5YuAaQTqURjwdRKD/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/XGkXGz5YuAaQTqURjwdRKD/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "d7a83c00-6d4b-4054-9223-6e49ae4f63d7"
                }
            ]
        },
        {
            "name": "2. benh tat khong gian khac",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/QYT7UR49LRjhLgY6zDorPL/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/QYT7UR49LRjhLgY6zDorPL/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "30a83508-7548-44fd-91ae-2c84919b8cd6"
                }
            ]
        },
        {
            "name": "3. ma tuy",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/RDs8ZtRkyhPQnz9HM7c9ZG/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/RDs8ZtRkyhPQnz9HM7c9ZG/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "9b9745b1-7f8f-4392-8783-93dcabe8b358"
                }
            ]
        },
        {
            "name": "4. chu tinh vuong",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/AFCK1r5Pu5xW3tp7t2iyNF/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/AFCK1r5Pu5xW3tp7t2iyNF/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "eb365c71-24ef-4fb3-a978-51a6ae4542d4"
                }
            ]
        },
        {
            "name": "5. dai bang khong co don",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/2EnoE22YtZJh597gGrGaJJ/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/2EnoE22YtZJh597gGrGaJJ/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "432617f8-388e-4b3c-9a21-629d14ae1737"
                }
            ]
        },
        {
            "name": "6. hurry up tell the world",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/6y5UxUssRM1R8PFHUrBKG6/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/6y5UxUssRM1R8PFHUrBKG6/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "36739f55-2715-4829-906b-1a3167a884ba"
                }
            ]
        },
        {
            "name": "7. trong phap",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/5Qzcz4ZL1S8DrEgk7A57e9/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/5Qzcz4ZL1S8DrEgk7A57e9/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "4b9074d7-0c66-438a-81b6-a67ef58725ff"
                }
            ]
        },
        {
            "name": "8. SU THAT KHO TIN",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/ABgu2o7Y9uxnJRTc2vzpSv/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/ABgu2o7Y9uxnJRTc2vzpSv/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "09f65904-8ee4-44e4-bc55-4948379cf350"
                }
            ]
        },
        {
            "name": "9. tim phut binh an",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/22KRiEMcH5rnHxSEsbxtYT/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/22KRiEMcH5rnHxSEsbxtYT/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "2febbd7c-c62e-41bc-b481-f26ab7dc7c1e"
                }
            ]
        },
        {
            "name": "10. mua hoa tet",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/XXYxe25NtYHyQacezaSwt5/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/XXYxe25NtYHyQacezaSwt5/cmaf/manifest.m3u8",
            "keys": [
                {
                    "keyId": "9836ec13-7277-4248-bed8-10bda99c92d1"
                }
            ]
        },
        {
            "name": "11. On dich tro lai",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/H3HXBU5eQSm4y2xRHNY64a/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/H3HXBU5eQSm4y2xRHNY64a/cmaf/manifest.m3u8",
            "keys": [{"keyId": "c57b9004-6360-480d-b46c-3374d642734d"}]
        },
        {
            "name": "12. trot 1 lan that than",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/JirGPAV7Qj9WaZMotEm4VL/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/JirGPAV7Qj9WaZMotEm4VL/cmaf/manifest.m3u8",
            "keys": [{"keyId": "59c1f25c-3010-4a9f-a06d-1eb3dcdbbe9e"}]
        },
        {
            "name": "13. Cach moi Than ko mua vang",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/QrizFkKW4Y2n39DzSDs3C6/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/QrizFkKW4Y2n39DzSDs3C6/cmaf/manifest.m3u8",
            "keys": [{"keyId": "29d039f1-433f-4db5-b59d-00cd785b4f74"}]
        },
        {
            "name": "14. Bach Hac bao mong",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/FXUpQotfFhMM7ny7FejDZY/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/FXUpQotfFhMM7ny7FejDZY/cmaf/manifest.m3u8",
            "keys": [{"keyId": "258719b4-e756-43e9-9e4f-388fd9af2054"}]
        },
        {
            "name": "15. Thor than vi",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/CB49APdcbToaJU7a2A9a3N/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/CB49APdcbToaJU7a2A9a3N/cmaf/manifest.m3u8",
            "keys": [{"keyId": "023eccf5-21ac-44d8-943d-fb1f5cad3109"}]
        },
        {
            "name": "16. Mot doi di buon",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/Q1nmuzqRt8NLF8wdqMeMHe/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/Q1nmuzqRt8NLF8wdqMeMHe/cmaf/manifest.m3u8",
            "keys": [{"keyId": "28860a61-6e09-403b-903b-3a0387678d05"}]
        },
        {
            "name": "17. Hoa don ket toan",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/WjGb28o1C8eua1AxEAEtpr/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/WjGb28o1C8eua1AxEAEtpr/cmaf/manifest.m3u8",
            "keys": [{"keyId": "6ce97b61-b44b-4e97-b85f-cfb7ac00e4ed"}]
        },
        {
            "name": "18. Ma do An Do",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/FJQPNW8M8seKFTKHpbxyCF/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/FJQPNW8M8seKFTKHpbxyCF/cmaf/manifest.m3u8",
            "keys": [{"keyId": "20bf02c2-3a9a-4e64-8b05-a579cd5a4233"}]
        },
        {
            "name": "19. Mai Vu",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/iQQpsze4qgrcxmSkyCmDZ/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/iQQpsze4qgrcxmSkyCmDZ/cmaf/manifest.m3u8",
            "keys": [{"keyId": "abd8d4f8-720e-43cd-8f13-60afd49c237f"}]
        },
        {
            "name": "20. Dan ong vs Gay",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/SPrndUbEcV47pMRtSHZNCT/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/SPrndUbEcV47pMRtSHZNCT/cmaf/manifest.m3u8",
            "keys": [{"keyId": "794dc8b1-7f98-471b-9e03-b62747b5bcfe"}]
        },
        {
            "name": "21. Nhat duoc tien roi",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/Xb45paMwo3bYfwTCicFFTR/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/Xb45paMwo3bYfwTCicFFTR/cmaf/manifest.m3u8",
            "keys": [{"keyId": "454aa093-a960-46c1-aa0c-66cbef19b6b5"}]
        },
        {
            "name": "22. Trump ko vacxin",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/48DTf1fnFRRuwS8B2t59mf/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/48DTf1fnFRRuwS8B2t59mf/cmaf/manifest.m3u8",
            "keys": [{"keyId": "128b64bb-3b57-45ec-a311-a2547c3acc44"}]
        },
        {
            "name": "23. Tinh duc tinh thuong",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/y4uc3zYYZcrPUwqxcB6Ur/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/y4uc3zYYZcrPUwqxcB6Ur/cmaf/manifest.m3u8",
            "keys": [{"keyId": "4f883600-2c76-474d-aa87-6c4f29f1ea22"}]
        },
        {
            "name": "24. Canada tu te",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/DEvBKL2EsoMtpafCJBqQQk/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/DEvBKL2EsoMtpafCJBqQQk/cmaf/manifest.m3u8",
            "keys": [{"keyId": "e4155e3d-7482-45d5-87fe-6fa540ba5676"}]
        },
        {
            "name": "25. Hieu Dan",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/gJD32xwdMiTmfPFdSAmjr/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/gJD32xwdMiTmfPFdSAmjr/cmaf/manifest.m3u8",
            "keys": [{"keyId": "39e6b17a-35ae-4e66-99f2-703e38717981"}]
        },
        {
            "name": "26. Sai Gon goi do cuu tro",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/SCxhdNj6dAiy9zWR937rdj/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/SCxhdNj6dAiy9zWR937rdj/cmaf/manifest.m3u8",
            "keys": [{"keyId": "c6834d99-fcac-4319-8bb7-541e4a3ce8fb"}]
        },
        {
            "name": "27. Sai Gon mat con",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/CSBXpQ5RcrH1ES9SZQFvTa/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/CSBXpQ5RcrH1ES9SZQFvTa/cmaf/manifest.m3u8",
            "keys": [{"keyId": "70f2d7c7-a1dd-4e84-8f4d-3a577da501b7"}]
        },
        {
            "name": "28. Phan boi loi the",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/AbYPmc3KYa43umWfnLXUTk/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/AbYPmc3KYa43umWfnLXUTk/cmaf/manifest.m3u8",
            "keys": [{"keyId": "3af23341-c438-415a-9461-2d3881b1387c"}]
        },
        {
            "name": "29. Noc 1 ly ruou",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/fD6kqKsdpNSwm7uDhP5dR/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/fD6kqKsdpNSwm7uDhP5dR/cmaf/manifest.m3u8",
            "keys": [{"keyId": "96f2a0d1-a75e-4d45-869c-05f931ae4644"}]
        },
        {
            "name": "30. Tao Thao",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/WCKYffhHaCv6EvBQa5jn2S/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/WCKYffhHaCv6EvBQa5jn2S/cmaf/manifest.m3u8",
            "keys": [{"keyId": "5f3002d6-325f-4049-814a-487c536c7809"}]
        },
        {
            "name": "31. Dung khi phi thuong",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/TE5gCRJZV45wnxchLTnKkT/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/TE5gCRJZV45wnxchLTnKkT/cmaf/manifest.m3u8",
            "keys": [{"keyId": "fd6a3f5a-dfc5-47e2-9c64-e7e6b03fbaa8"}]
        },
        {
            "name": "32. Bang lon nhat An Do",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/HWw3JCpjyLoQbhZ5e55kEc/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/HWw3JCpjyLoQbhZ5e55kEc/cmaf/manifest.m3u8",
            "keys": [{"keyId": "22e460eb-97ac-445d-b9b5-e3972715ae61"}]
        },
        {
            "name": "33. Tien si Ep tiem vx",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/SwRKX5HT1Q7GtFbKq8ocpu/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/SwRKX5HT1Q7GtFbKq8ocpu/cmaf/manifest.m3u8",
            "keys": [{"keyId": "5afe3c77-cd0d-4055-81dc-bab36e44f9c6"}]
        },
        {
            "name": "34. Cuoc hen bat ngo",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/6rQNZMJwi1gEemtJXKYFVY/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/6rQNZMJwi1gEemtJXKYFVY/cmaf/manifest.m3u8",
            "keys": [{"keyId": "4419cc2f-b536-4220-abf8-ac399561d695"}]
        },
        {
            "name": "35. Canh gioi tri chong",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/EY58UZdjgNqQYF7VtpFR2v/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/EY58UZdjgNqQYF7VtpFR2v/cmaf/manifest.m3u8",
            "keys": [{"keyId": "8a2b23c2-967d-4031-87bd-d65ce2e733c1"}]
        },
        {
            "name": "36. Trump card",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/P9VjGzoutWkRzmfMG6dYer/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/P9VjGzoutWkRzmfMG6dYer/cmaf/manifest.m3u8",
            "keys": [{"keyId": "e91f2a3d-d366-4164-85ca-631404e10eec"}]
        },
        {
            "name": "37. Kenh dau tu bi mat",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/AvGsZBfNSsYHgisjv2H1VD/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/AvGsZBfNSsYHgisjv2H1VD/cmaf/manifest.m3u8",
            "keys": [{"keyId": "90e53403-9b48-4e9f-b5ce-5e80195f5f1e"}]
        },
        {
            "name": "38. Virus coc kien troi",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/KydZvK7MzFFrVvSR7ixNyV/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/KydZvK7MzFFrVvSR7ixNyV/cmaf/manifest.m3u8",
            "keys": [{"keyId": "efc5a7c9-8059-4ea7-be07-bf4fe97fc3b5"}]
        },
        {
            "name": "39. Am muu dai dich",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/BXdwHBvkuBzkfVrmSvBe6t/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/BXdwHBvkuBzkfVrmSvBe6t/cmaf/manifest.m3u8",
            "keys": [{"keyId": "ce1db408-8af4-4b78-9777-675df005a16f"}]
        },
        {
            "name": "40. dai dich covid 10ph",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/TYgnj69jCeceh7oFybJyAQ/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/TYgnj69jCeceh7oFybJyAQ/cmaf/manifest.m3u8",
            "keys": [{"keyId": "c20d591f-ccbb-4924-8937-4b296535910b"}]
        },
        {
            "name": "41. ac long khoi chien",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/63WxkYTRcZshMmjpsimGYP/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/63WxkYTRcZshMmjpsimGYP/cmaf/manifest.m3u8",
            "keys": [{"keyId": "e1401cbf-4fa1-4664-b1a3-7ae2e2b030cc"}]
        },
        {
            "name": "42. Ukraine trang den",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/KfC5z4UJH84FskyxR3cwJu/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/KfC5z4UJH84FskyxR3cwJu/cmaf/manifest.m3u8",
            "keys": [{"keyId": "61f3c5d8-477e-4140-9e76-f4a750a0fa5a"}]
        },
        {
            "name": "43. Ukraine that thu",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/Gu9yQfcGhCzxzyTLh2PVcH/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/Gu9yQfcGhCzxzyTLh2PVcH/cmaf/manifest.m3u8",
            "keys": [{"keyId": "176f32a4-a6ce-4d53-9305-173de554745b"}]
        },
        {
            "name": "44. Khung hoang tien te luong thuc",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/EWPBN4oSHCBWSbQkUBAfdS/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/EWPBN4oSHCBWSbQkUBAfdS/cmaf/manifest.m3u8",
            "keys": [{"keyId": "2d0d4f53-78cf-4ca5-82a0-c7a8e24f0743"}]
        },
        {
            "name": "45. The luc ngam 100 nam",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/WeXz1AxePivWpYuYpKcYpb/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/WeXz1AxePivWpYuYpKcYpb/cmaf/manifest.m3u8",
            "keys": [{"keyId": "52213c5c-a465-42ee-9a42-723ffda7a4dd"}]
        },
        {
            "name": "46. binh yen xu Co Hoa",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/Xbd26xn1NMQLquNu9BhxJv/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/Xbd26xn1NMQLquNu9BhxJv/cmaf/manifest.m3u8",
            "keys": [{"keyId": "63f194f9-3edc-4588-83e7-ad5bf7ed0161"}]
        },
        {
            "name": "47. hai vua khong hau",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/2qUYQe1Hqg56PgLCc1zPT6/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/2qUYQe1Hqg56PgLCc1zPT6/cmaf/manifest.m3u8",
            "keys": [{"keyId": "70fb7020-02c8-40bb-b946-0df3af385a9f"}]
        },
        {
            "name": "48. Cuoc chien linh hon",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/GquB4VUdfV4LPaVdP2s4A4/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/GquB4VUdfV4LPaVdP2s4A4/cmaf/manifest.m3u8",
            "keys": [{"keyId": "bb755330-b48d-40f2-9ea9-ad0e8b3ad8e7"}]
        },
        {
            "name": "49. Phan bon vinh cuu",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/JYXUtTxNbGEegS2VAathSu/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/JYXUtTxNbGEegS2VAathSu/cmaf/manifest.m3u8",
            "keys": [{"keyId": "4de48c15-e62a-4765-b1c8-8d14acca128c"}]
        },
        {
            "name": "50. Det dao to tam",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/4UnbNpzmPiA1H9A4SbU44n/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/4UnbNpzmPiA1H9A4SbU44n/cmaf/manifest.m3u8",
            "keys": [{"keyId": "cf4c3d95-5a64-4de6-b6d8-330b4b9622cc"}]
        },
        {
            "name": "51. Quy du dong tinh",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/NnC3HxxC774vZtcSfPm7G3/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/NnC3HxxC774vZtcSfPm7G3/cmaf/manifest.m3u8",
            "keys": [{"keyId": "9fb9dfda-afa2-4e4e-bc7e-be77799c74e2"}]
        },
        {
            "name": "52. Dot tu vx",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/D27YHoBQPNfC3kvXVwVGmS/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/D27YHoBQPNfC3kvXVwVGmS/cmaf/manifest.m3u8",
            "keys": [{"keyId": "73c2fdc9-e9cf-43b8-8f0e-b6de313d4603"}]
        },
        {
            "name": "53. Long mach phong thuy",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/AGynho7G6grgYn2CdLdQ1D/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/AGynho7G6grgYn2CdLdQ1D/cmaf/manifest.m3u8",
            "keys": [{"keyId": "433151c2-b60f-41cf-98e9-6d16ce5e67cc"}]
        },
        {
            "name": "54. Trung Quoc tra nghiep",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/8BSSQ3CK1te7PwHyrujpRH/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/8BSSQ3CK1te7PwHyrujpRH/cmaf/manifest.m3u8",
            "keys": [{"keyId": "49f0f7be-4a18-42d9-b8a4-868abf5d500b"}]
        },
        {
            "name": "55. Am muu Pfizer",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/6p145QpkWZAh4xrcfc8Pdw/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/6p145QpkWZAh4xrcfc8Pdw/cmaf/manifest.m3u8",
            "keys": [{"keyId": "5e1f0ba9-d690-44ef-83c1-373585aa47c4"}]
        },
        {
            "name": "56. Duc chua ung thu",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/6YwirmWWHRnwCxkTZxS6U2/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/6YwirmWWHRnwCxkTZxS6U2/cmaf/manifest.m3u8",
            "keys": [{"keyId": "e5d642c4-be46-42be-8047-5714a051935b"}]
        },
        {
            "name": "57. Chinh phu cho USD sup do",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/H71cFkuHoVu5qPrz4dSR1f/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/H71cFkuHoVu5qPrz4dSR1f/cmaf/manifest.m3u8",
            "keys": [{"keyId": "28df3a8c-a145-42dc-96ea-20561d4a62c9"}]
        },
        {
            "name": "58. Giam dan so",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/SnCNU3iW2Zea4yEginXGbC/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/SnCNU3iW2Zea4yEginXGbC/cmaf/manifest.m3u8",
            "keys": [{"keyId": "9524e986-db8c-4192-99aa-3b90d1fddd30"}]
        },
        {
            "name": "59. Nau an tam phap",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/FELeouB9EpyfMwNFXxDafb/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/FELeouB9EpyfMwNFXxDafb/cmaf/manifest.m3u8",
            "keys": [{"keyId": "fcdc7292-6fc2-42bf-8f34-edffc216692c"}]
        },
        {
            "name": "60. Tro tru vi nguoc",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/ASxKqouf7ob9JciUk2m73a/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/ASxKqouf7ob9JciUk2m73a/cmaf/manifest.m3u8",
            "keys": [{"keyId": "c721b6d8-a9cc-4889-866c-cbfd4f2380fa"}]
        },
        {
            "name": "61. Cuoc dai thuc tinh",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/Tv68DiwzEC6NpsFamgYVmQ/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/Tv68DiwzEC6NpsFamgYVmQ/cmaf/manifest.m3u8",
            "keys": [{"keyId": "4f96f251-fde6-469e-a00d-d48a22681839"}]
        },
        {
            "name": "62. Dung so the luc ngam",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/AnRrpjKrxPviTGgPJfZZkN/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/AnRrpjKrxPviTGgPJfZZkN/cmaf/manifest.m3u8",
            "keys": [{"keyId": "f487c680-8057-47c5-b900-ad13e493587a"}]
        },
        {
            "name": "63. Israel",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/UMMwAZDSaPop6WQJ3TwiHq/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/UMMwAZDSaPop6WQJ3TwiHq/cmaf/manifest.m3u8",
            "keys": [{"keyId": "90824400-98fa-46d1-9adf-0f0994e870c1"}]
        },
        {
            "name": "64. Cuu lay con sach giao khoa",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/2rxnQE87BYNYYer3oxUztm/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/2rxnQE87BYNYYer3oxUztm/cmaf/manifest.m3u8",
            "keys": [{"keyId": "30987073-096a-4bf4-a442-6ad744d87377"}]
        },
        {
            "name": "65. Ung thu sieu toc",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/YHNX7ph7RJvGsTpuwhxeWd/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/YHNX7ph7RJvGsTpuwhxeWd/cmaf/manifest.m3u8",
            "keys": [{"keyId": "dd481f16-f2d0-4955-94cc-adedabc322b0"}]
        },
        {
            "name": "66. Dau an",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/81zWmvAszMSZhZRMcybWiY/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/81zWmvAszMSZhZRMcybWiY/cmaf/manifest.m3u8",
            "keys": [{"keyId": "19bb2938-05ec-4ae8-a271-ffa5b21aceef"}]
        },
        {
            "name": "67. Noi oan Mat Troi",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/KesqA71RVDKD4vbmQ88WfV/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/KesqA71RVDKD4vbmQ88WfV/cmaf/manifest.m3u8",
            "keys": [{"keyId": "ea6a55cc-46f9-4855-bec2-9a3816b934e7"}]
        },
        {
            "name": "68. Tay y",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/USeqMLfceD4Jd7FKLJL3kC/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/USeqMLfceD4Jd7FKLJL3kC/cmaf/manifest.m3u8",
            "keys": [{"keyId": "95f86d6e-8085-4737-9415-13bae6a050c0"}]
        },
        {
            "name": "69. Mat ong len men",
            "url": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/DBNuaya4RegNJMeNiTJe51/cmaf/manifest.mpd",
            "hlsUrl": "https://8d86a98a0a9426a560f8d992.blob.core.windows.net/video-output/DBNuaya4RegNJMeNiTJe51/cmaf/manifest.m3u8",
            "keys": [{"keyId": "8bc971be-6f99-4262-8327-e5a6879a5b8e"}]
        }        
    ];

    // Verifies that all critical information is present on a video.
    function verifyVideoIntegrity(video) {
        if (!video)
            throw new Error("A video was expected but was not present.");
        if (!video.name || !video.name.length)
            throw new Error("A video is missing its name.");

        console.log("Verifying integrity of video definition: " + video.name);

        if (!video.url || !video.url.length)
            throw new Error("The video is missing its URL.");

        // Either a hardcoded license token or the keys structure must exist. Not both.
        if (video.licenseToken && video.keys)
            throw new Error("The video has both a hardcoded license token and a content key list - pick only one.");
        if (!video.licenseToken && !video.keys)
            throw new Error("The video is missing the content key list.");

        if (video.keys) {
            if (!video.keys.length)
                throw new Error("The content key list for this video is empty.");

            // Verify that each item in the keys list has all the required data.
            video.keys.forEach(function verifyKey(item) {
                if (!item.keyId)
                    throw new Error("A content key is missing the key ID.");
            });
        }
    }

    // Verify all videos on startup.
    allVideos.forEach(verifyVideoIntegrity);

    module.exports = {
        "getAllVideos": function getAllVideos() {
            return allVideos;
        },
        "getVideoByName": function getVideoByName(name) {
            return allVideos.find(function filter(item) {
                return item.name === name;
            });
        }
    };
})();
